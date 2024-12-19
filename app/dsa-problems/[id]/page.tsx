'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Import useParams hook
import Navbar from '@/app/components/Navbar';
import CodeEditorContainer from '@/app/components/CodeEditor/CodeEditorContainer';
import QuestionHolder from '@/app/components/QuestionHolder/QuestionHolder';

const DSAProblemsPage = () => {
  const { id } = useParams(); // Use useParams hook to get the dynamic segment
  const [questionData, setQuestionData] = useState<any>(null);

  useEffect(() => {
    if (!id) return; // Wait until id is available
    const fetchQuestionData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/${id}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch question data');
        }
        const data = await response.json();
        setQuestionData(data);
      } catch (error) {
        console.error('Error fetching question data:', error);
      }
    };

    fetchQuestionData();
  }, [id]);

  if (!questionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Navbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-gray-300 overflow-auto pt-16">
          <div className="p-2">
            <QuestionHolder
              title={questionData.title}
              description={questionData.description}
              examples={questionData.examples}
              constraints={questionData.constraints}
            />
          </div>
        </div>
        <div className="w-1/2 overflow-auto pt-16">
          <div className="p-2">
            <CodeEditorContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAProblemsPage;
