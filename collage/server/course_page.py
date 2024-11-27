import collage
from flask import jsonify, request
import flask
import mysql.connector
from collage.server.agent import collage_ai_agent, form_prompt_2
from flask_jwt_extended import jwt_required

@collage.app.route('/api/course/<int:course_id>', methods=['GET'])
@jwt_required()
def get_course(course_id):
    try:
        connection = collage.model.get_db()
        with connection.cursor(dictionary=True) as cursor:
            # Fetch course details
            query = """
                SELECT course_id, course_name, course_description, credit_hours AS credits,
                    class_topic AS department, icon_url AS ai_img_url
                FROM courses
                WHERE course_id = %s
            """
            cursor.execute(query, (course_id,))
            course = cursor.fetchone()

            # Query to get all tags associated with the course
            tags_query = """
                SELECT t.tag_name
                FROM tags t
                JOIN course_tags ct ON t.tag_id = ct.tag_id
                WHERE ct.course_id = %s
            """
            cursor.execute(tags_query, (course_id,))
            tags = [row['tag_name'] for row in cursor.fetchall()]
            course["tags"] = tags

            if course:
                return jsonify(course)
            else:
                return jsonify({'message': 'Course not found'}), 404

    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({'error': 'Database error'}), 500


# Route to get Collage Board friends
@collage.app.route('/api/friends', methods=['GET'])
@jwt_required()
def get_friends():
    try:
        connection = collage.model.get_db()
        with connection.cursor(dictionary=True) as cursor:
            # Fetch friends' data
            query = """
                SELECT user_id, full_name, major
                FROM users
                LIMIT 3
            """
            cursor.execute(query)
            friends = cursor.fetchall()

            friend_list = [
                {'user_id': friend['user_id'],
                    'full_name': friend['full_name'], 'major': friend['major']}
                for friend in friends
            ]
            return jsonify(friend_list)

    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({'error': 'Database error'}), 500


@collage.app.route('/api/ai-course-finder', methods=['POST'])
@jwt_required()
def ai_course_finder():
    user_input = request.json.get('query')
    course_data = request.json.get('course', {})
    active_tab = request.json.get('tab', 'Academic')

    # Fetch course details from the payload
    course_name = course_data.get('name', 'the course')
    course_description = course_data.get('description', '')
    credits = course_data.get('credits', '')
    department = course_data.get('department', '')
    tags = ', '.join(course_data.get('tags', []))

    connection = collage.model.get_db()
    with connection.cursor(dictionary=True) as cursor:
        cursor.execute("SELECT * FROM user_keywords WHERE user_id = %s", (flask.session['user_id'],))
        user_keywords = cursor.fetchone()
        if user_keywords is not None:
            user_keywords = user_keywords["keywords"]
        else:
            user_keywords = ""

    # Construct the prompt with course-specific information
    prompt = form_prompt_2(course_name, course_description, credits, department, tags, active_tab, user_keywords)

    response = collage_ai_agent(user_input, prompt)
    return jsonify({'response': response})


# Route to save a course for a user
@collage.app.route('/api/save-course', methods=['POST'])
@jwt_required()
def save_course():
    course_id = request.json.get('course_id')

    try:
        connection = collage.model.get_db()
        with connection.cursor(dictionary=True) as cursor:
            # Insert saved course record
            query = """
                INSERT INTO saved_courses (user_id, course_id)
                VALUES (%s, %s)
            """
            cursor.execute(query, (flask.session['user_id'], course_id))
            connection.commit()

            return jsonify({'message': 'Course saved successfully'})

    except mysql.connector.Error as err:
        print("Error:", err)
        if err.errno == 1062:
            return jsonify({'error': 'Course already saved'}), 400
        else:
            return jsonify({'error': 'Database error'}), 500

@collage.app.route('/api/get-saved-courses/<int:user_id>', methods=['GET'])
@jwt_required()
def get_saved_courses(user_id):
    try:
        connection = collage.model.get_db()
        with connection.cursor(dictionary=True) as cursor:
            print(flask.session['user_id'])
            query = """
                SELECT course_id
                FROM saved_courses
                WHERE user_id = %s
            """
            cursor.execute(query, (user_id,))
            saved_courses = cursor.fetchall()

            if not saved_courses:
                return jsonify({"courses": []}), 200

            course_details = []

            # Loop through each saved course and fetch its details
            for course in saved_courses:
                course_id = course.get('course_id')
                if not course_id:
                    continue  # Skip if course_id is missing
                print(course_id)

                # Query to fetch course details by course_id
                course_query = """
                    SELECT course_id, icon_url, course_code, course_code, course_description, total_rating, num_ratings
                    FROM courses
                    WHERE course_id = %s
                """
                cursor.execute(course_query, (course_id,))
                course_info = cursor.fetchone()

                if course_info:
                    if course_info['num_ratings'] != 0:
                        course_info['rating'] = course_info['total_rating'] // course_info['num_ratings']
                    else:
                        course_info['rating'] = 0
                    course_details.append(course_info)

            return jsonify({"courses": course_details}), 200

    except mysql.connector.Error as err:
        print("Error:", err)
        if err.errno == 1062:
            return jsonify({'error': 'Course already saved'}), 400
        else:
            return jsonify({'error': 'Database error'}), 500

@collage.app.route('/api/is-course-saved/<int:course_id>', methods=['GET'])
@jwt_required()
def is_course_saved(course_id):
    try:
        connection = collage.model.get_db()
        with connection.cursor(dictionary=True) as cursor:
            query = """
                SELECT course_id
                FROM saved_courses
                WHERE user_id = %s AND course_id = %s
            """

            cursor.execute(query, (flask.session['user_id'], course_id))
            course = cursor.fetchone();
            if course is None:
                return jsonify({'is_saved': False}), 200
            else:
                return jsonify({'is_saved': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@collage.app.route('/api/delete-saved-course', methods=['DELETE'])
@jwt_required()
def delete_saved_course():
    course_id = flask.request.json.get('course_id')

    connection = collage.model.get_db()
    with connection.cursor(dictionary=True) as cursor:
        query = """
            DELETE FROM saved_courses
            WHERE user_id=%s AND course_id = %s
        """
        cursor.execute(query, (flask.session['user_id'], course_id,))
        connection.commit()

        return jsonify({'message': 'Course unsaved successfully'})


@collage.app.route('/api/top-six-followers', methods=['GET'])
@jwt_required()
def top_six_followers():
    connection = collage.model.get_db()
    with connection.cursor(dictionary=True) as cursor:
        query = """
            SELECT
                u.user_id AS id,
                u.full_name AS name,
                u.major,
                u.profile_img_url AS profileImage,
                u.followers_count
            FROM
                users u
            LEFT JOIN
                connections c
            ON
                u.user_id = c.followed_id
                AND c.follower_id = %s
                AND (c.relationship = 'following' OR c.relationship = 'pending')
            WHERE
                c.follower_id IS NULL
                AND u.user_id != %s
            ORDER BY
                u.followers_count DESC
            LIMIT 6;
        """
        cursor.execute(query, (flask.session['user_id'], flask.session['user_id']))
        results = cursor.fetchall()
        return jsonify(results), 200
