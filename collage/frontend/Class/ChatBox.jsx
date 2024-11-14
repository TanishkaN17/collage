import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import '../CSS/classPreview.css';

const ChatSection = styled.div`
  background-color: #f0f4ff;
  padding: 20px;
  flex: 2;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid #c3c3c3;
  border-radius: 31px;
  height: 453px;
  margin-top: 45px;
`;

const TabButton = styled.button`
  padding: 10px;
  font-size: 14px;
  background-color: ${({ active }) => (active ? '#333' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 5px;
`;

const ChatInput = styled.input`
  border: none;
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  font-size: 16px;
`;

const ChatBox = ({ courseId }) => {
  console.log("CourseId:", courseId);
  const [activeTab, setActiveTab] = useState('Academic');
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [courseData, setCourseData] = useState(null);

  const placeholderQuestions = {
    Academic: "How intense is the course load in this course?",
    Availability: "Will this course fill up before my registration date?",
    Professional: "How does this course apply to real-world careers?"
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const response = await axios.get(`/api/individual-course/${courseId}`);
          setCourseData(response.data);
          console.log("Fetched course data:", response.data);
        } catch (error) {
          console.error("Error fetching course data:", error);
        }
      };
      fetchCourseData();
    } else {
      console.warn("No course ID provided to fetch course data.");
    }
  }, [courseId]);

  const handleCourseFinder = async () => {
    try {
      const payload = {
        query,
        course: {
          name: courseData?.course_name,
          description: courseData?.course_description,
          credits: courseData?.credit_hours,
          department: courseData?.department,
          tags: [courseData?.tag_1, courseData?.tag_2, courseData?.tag_3, courseData?.tag_4, courseData?.tag_5].filter(Boolean), // Filter out any undefined tags
        },
        tab: activeTab
      };

      const res = await axios.post('/api/ai-course-finder', payload);
      setAiResponse(res.data.response || 'No AI response available');
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResponse('No AI response available');
    }
  };

  return (
    <div className="chat-box">
      <ChatSection>
        <div style={{ display: 'flex', gap: '10px' }}>
          <TabButton active={activeTab === 'Academic'} onClick={() => handleTabChange('Academic')}>Academic</TabButton>
          <TabButton active={activeTab === 'Availability'} onClick={() => handleTabChange('Availability')}>Availability</TabButton>
          <TabButton active={activeTab === 'Professional'} onClick={() => handleTabChange('Professional')}>Professional</TabButton>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '15px', backgroundColor: '#fff', height: '100%' }}>
          {aiResponse || placeholderQuestions[activeTab]}
        </div>
        <ChatInput
          type="text"
          placeholder={placeholderQuestions[activeTab]}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleCourseFinder} style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#333', color: '#fff', border: 'none', marginTop: '10px' }}>
          Ask
        </button>
      </ChatSection>
    </div>
  );
};

export default ChatBox;