import React, { useEffect, useState } from "react";
import "./CSS/Schedule.css";
import tinycolor from "tinycolor2";

const Schedule = ({ user_id }) => {
  const [scheduleData, setScheduleData] = useState([]);

  // Fetch schedule data (mocked for now)
  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          courseNumber: "ENGLISH 362",
          sectionNumber: "001",
          courseColor: "#F28B82",
          sections: [
            { type: "Lecture", day: "Mon", startTime: "10:00", endTime: "11:30" },
            { type: "Lecture", day: "Wed", startTime: "10:00", endTime: "11:30" },
          ],
        },
        {
          courseNumber: "ECON 398",
          sectionNumber: "002",
          courseColor: "#AECBFA",
          sections: [
            { type: "Lecture", day: "Tue", startTime: "11:30", endTime: "13:00" },
            { type: "Discussion", day: "Fri", startTime: "16:00", endTime: "17:00" },
          ],
        },
        {
          courseNumber: "POLSCI 369",
          sectionNumber: "001",
          courseColor: "#81C995",
          sections: [
            { type: "Lecture", day: "Mon", startTime: "14:30", endTime: "16:00" },
            { type: "Lecture", day: "Wed", startTime: "14:30", endTime: "16:00" },
            { type: "Discussion", day: "Wed", startTime: "16:00", endTime: "17:00" },
          ],
        },
        {
          courseNumber: "PPE 300",
          sectionNumber: "001",
          courseColor: "#FFCC80",
          sections: [
            { type: "Lecture", day: "Thu", startTime: "15:00", endTime: "16:00" },
            { type: "Discussion", day: "Fri", startTime: "12:00", endTime: "14:00" },
          ],
        },
      ];
      setScheduleData(data);
    };

    fetchData();
  }, [user_id]);

  const timeToPosition = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return (hour - 8) * 60 + (minute / 60) * 60; // Starting from 8 AM
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <select>
          <option>Fall 2024</option>
        </select>
        <input
          type="text"
          className="schedule-input"
          placeholder="Ask our advisor AI about a potential schedule"
        />
      </div>
      <div className="schedule-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
          <div key={day} className="schedule-day">
            <div className="schedule-day-header">{day}</div>
            <div className="schedule-day-body">
              {scheduleData.map((course) =>
                course.sections
                  .filter((section) => section.day === day)
                  .map((section, index) => {
                    const darkTextColor = tinycolor(course.courseColor).darken(50).toString();
                    const borderColor = tinycolor(course.courseColor).darken(50).toString();

                    return (
                      <div
                        key={index}
                        className="schedule-item"
                        style={{
                          top: `${timeToPosition(section.startTime)}px`,
                          height: `${timeToPosition(section.endTime) - timeToPosition(section.startTime)}px`,
                          backgroundColor: course.courseColor,
                          color: darkTextColor,
                          border: `1px solid ${borderColor}`,
                        }}
                      >
                        <div className="schedule-item-text">
                          {course.courseNumber} <br />
                          {section.type} ({course.sectionNumber}) <br />
                          {section.startTime} - {section.endTime}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
