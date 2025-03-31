import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const dataStructures = [
    {
      title: "Array",
      description: "A collection of elements stored at contiguous memory locations",
      href: "/data-structure-visualizer/array",
      icon: "[ ]",
    },
    {
      title: "Linked List",
      description: "A linear collection of elements where each element points to the next",
      href: "/data-structure-visualizer/linked-list",
      icon: "○→○→○",
    },
    {
      title: "Hash Table",
      description: "A data structure that maps keys to values using a hash function",
      href: "/data-structure-visualizer/hash-table",
      icon: "{ }",
    },
    {
      title: "Binary Search Tree",
      description: "A tree data structure with at most two children per node",
      href: "/data-structure-visualizer/binary-search-tree",
      icon: "△",
    },
    {
      title: "Binary Heap",
      description: "A complete binary tree where parent nodes compare to their children",
      href: "/data-structure-visualizer/binary-heap",
      icon: "▽",
    },
  ];

  return (
    <div className="bg-[#000000] min-h-screen mt-10 py-10 px-4 flex flex-col items-center text-gray-300">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Data Structure Visualizer</h1>
        <p className="mt-4 text-lg text-gray-400">
          Interactive visualizations to help you understand common data structures
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
        {dataStructures.map((ds) => (
          <Card key={ds.title} className="bg-[#1a1a1a] border border-gray-700 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader>
              <div className="text-4xl font-mono mb-2 text-purple-400">{ds.icon}</div>
              <CardTitle className="text-xl text-white">{ds.title}</CardTitle>
              <CardDescription className="text-gray-400">{ds.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={ds.href} className="w-full">
                <Button className="w-full bg-purple-500 hover:bg-orange-500 text-white flex items-center justify-center">
                  Visualize
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
