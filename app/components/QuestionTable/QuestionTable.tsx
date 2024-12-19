'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GameButton } from "./GameButton";
import { SolveButton } from "./SolveButton";

const QuestionTable: React.FC = () => {
  const [data, setData] = useState<Array<{ id: number, QId: string, questionName: string, status: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/questions/`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch question data');
        }

        const result: Array<{ id: number, title: string, status: string }> = await response.json();
        setData(result);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSolveClick = (id) => {
    window.location.href = `/dsa-problems/${id}`; // Direct navigation to the DSAProblems page
  };

  return (
    <div className="w-full sm:w-[95%] lg:w-[70%] mx-auto p-4 sm:p-6 lg:p-8 bg-gray-900 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse border border-gray-800">
          <TableHeader>
            <TableRow className="bg-gray-800">
              <TableHead className="text-white text-sm sm:text-base w-3/6">Questions</TableHead>
              <TableHead className="text-white text-sm sm:text-base w-2/6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-white">Loading...</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="border-b border-gray-800">
                  <TableCell className="text-white text-sm sm:text-base">{item.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <GameButton gameId={item.id} />
                      <SolveButton onClick={() => handleSolveClick(item.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuestionTable;
