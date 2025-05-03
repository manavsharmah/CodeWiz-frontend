"use client"

import { useState, useEffect, useRef } from "react"
import { AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  x?: number
  y?: number
  highlighted?: boolean
}

export default function BinarySearchTreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [value, setValue] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState<{ found: boolean } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 })

  // Calculate tree layout and draw on canvas
  useEffect(() => {
    if (!root) {
      setTreeNodes([])
      return
    }

    // Calculate positions for each node
    const nodes: TreeNode[] = []
    const calculatePositions = (
      node: TreeNode,
      depth: number,
      left: number,
      right: number
    ) => {
      if (!node) return

      const x = (left + right) / 2
      const y = depth * 70 + 50
      
      nodes.push({ ...node, x, y })
      
      if (node.left) {
        calculatePositions(node.left, depth + 1, left, x)
      }
      
      if (node.right) {
        calculatePositions(node.right, depth + 1, x, right)
      }
    }
    
    calculatePositions(root, 0, 0, canvasSize.width)
    setTreeNodes(nodes)
  }, [root, canvasSize.width])

  // Draw the tree on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw edges
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1.5
    
    for (const node of treeNodes) {
      if (node.left) {
        const leftNode = treeNodes.find(n => n.value === node.left!.value)
        if (leftNode && leftNode.x && leftNode.y && node.x && node.y) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(leftNode.x, leftNode.y)
          ctx.stroke()
        }
      }
      
      if (node.right) {
        const rightNode = treeNodes.find(n => n.value === node.right!.value)
        if (rightNode && rightNode.x && rightNode.y && node.x && node.y) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(rightNode.x, rightNode.y)
          ctx.stroke()
        }
      }
    }
    
    // Draw nodes
    for (const node of treeNodes) {
      if (node.x === undefined || node.y === undefined) continue
      
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)
      
      if (node.highlighted) {
        ctx.fillStyle = "#8B5DFF" 
      } else {
        ctx.fillStyle = "#F09319" 
      }
      
      ctx.fill()
      ctx.stroke()
      
      // Draw value with fixed high-contrast colors
      ctx.fillStyle = node.highlighted ? "#ffffff" : "#000"; // Use fixed black/white for maximum contrast
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(node.value.toString(), node.x, node.y);
    }
  }, [treeNodes])

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        setCanvasSize({
          width: container.clientWidth,
          height: Math.max(400, container.clientWidth * 0.6)
        })
      }
    }
    
    handleResize()
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (node === null) {
      return { value, left: null, right: null }
    }
    
    if (value < node.value) {
      return { ...node, left: insertNode(node.left, value) }
    } else if (value > node.value) {
      return { ...node, right: insertNode(node.right, value) }
    }
    
    // Value already exists, return the same node
    return node
  }

  const handleInsert = () => {
    if (!value) {
      setError("Please enter a value")
      return
    }
    
    const newValue = Number.parseInt(value)
    if (isNaN(newValue)) {
      setError("Please enter a valid number")
      return
    }
    
    setError(null)
    
    // Check if value already exists
    if (searchInTree(root, newValue)) {
      setError(`Value ${newValue} already exists in the tree`)
      return
    }
    
    const newRoot = insertNode(root, newValue)
    setRoot(newRoot)
    setValue("")
    
    // Highlight the newly inserted node
    setTimeout(() => {
      highlightNode(newValue)
      
      // Remove highlight after a delay
      setTimeout(() => {
        removeHighlights()
      }, 1000)
    }, 100)
  }

  const searchInTree = (node: TreeNode | null, value: number): boolean => {
    if (node === null) return false
    if (node.value === value) return true
    
    if (value < node.value) {
      return searchInTree(node.left, value)
    } else {
      return searchInTree(node.right, value)
    }
  }

  const handleSearch = () => {
    if (!searchValue) {
      setError("Please enter a value to search")
      return
    }
    
    const searchNum = Number.parseInt(searchValue)
    if (isNaN(searchNum)) {
      setError("Please enter a valid number")
      return
    }
    
    setError(null)
    
    // Animate the search process
    animateSearch(root, searchNum, [])
  }

  const animateSearch = (node: TreeNode | null, value: number, path: number[]) => {
    if (node === null) {
      // Not found
      setSearchResult({ found: false })
      return
    }
    
    const newPath = [...path, node.value]
    
    // Highlight the current node
    highlightPath(newPath)
    
    setTimeout(() => {
      if (node.value === value) {
        // Found
        setSearchResult({ found: true })
      } else if (value < node.value) {
        // Search in left subtree
        animateSearch(node.left, value, newPath)
      } else {
        // Search in right subtree
        animateSearch(node.right, value, newPath)
      }
    }, 500)
  }

  const highlightPath = (path: number[]) => {
    setTreeNodes(prev => 
      prev.map(node => ({
        ...node,
        highlighted: path.includes(node.value)
      }))
    )
  }

  const highlightNode = (value: number) => {
    setTreeNodes(prev => 
      prev.map(node => ({
        ...node,
        highlighted: node.value === value
      }))
    )
  }

  const removeHighlights = () => {
    setTreeNodes(prev => 
      prev.map(node => ({
        ...node,
        highlighted: false
      }))
    )
  }

  const findMinNode = (node: TreeNode): TreeNode => {
    let current = node
    while (current.left !== null) {
      current = current.left
    }
    return current
  }

  const deleteNode = (node: TreeNode | null, value: number): TreeNode | null => {
    if (node === null) return null
    
    if (value < node.value) {
      return { ...node, left: deleteNode(node.left, value) }
    } else if (value > node.value) {
      return { ...node, right: deleteNode(node.right, value) }
    } else {
      // Node to be deleted found
      
      // Case 1: Leaf node
      if (node.left === null && node.right === null) {
        return null
      }
      
      // Case 2: Node with only one child
      if (node.left === null) {
        return node.right
      }
      
      if (node.right === null) {
        return node.left
      }
      
      // Case 3: Node with two children
      const minNode = findMinNode(node.right)
      return {
        ...node,
        value: minNode.value,
        right: deleteNode(node.right, minNode.value)
      }
    }
  }

  const handleDelete = () => {
    if (!searchValue) {
      setError("Please enter a value to delete")
      return
    }
    
    const deleteVal = Number.parseInt(searchValue)
    if (isNaN(deleteVal)) {
      setError("Please enter a valid number")
      return
    }
    
    setError(null)
    
    // Check if value exists
    if (!searchInTree(root, deleteVal)) {
      setError(`Value ${deleteVal} does not exist in the tree`)
      return
    }
    
    // Highlight the node to be deleted
    highlightNode(deleteVal)
    
    setTimeout(() => {
      const newRoot = deleteNode(root, deleteVal)
      setRoot(newRoot)
      setSearchValue("")
      setSearchResult(null)
      removeHighlights()
    }, 1000)
  }

  const timeComplexity = {
    access: "O(log n) - O(n)",
    search: "O(log n) - O(n)",
    insertion: "O(log n) - O(n)",
    deletion: "O(log n) - O(n)",
  }

  return (
    <div className="container mt-10 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Binary Search Tree Visualizer</h1>
        <p className="text-muted-foreground">
          A binary search tree is a binary tree where each node has at most two children, and for each node, all values in the left subtree are less than the node's value, and all values in the right subtree are greater.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Visual representation of the binary search tree data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto">
                <canvas 
                  ref={canvasRef} 
                  width={canvasSize.width} 
                  height={canvasSize.height}
                  className="mx-auto"
                />
              </div>

              {treeNodes.length === 0 && (
                <div className="text-center text-muted-foreground italic mt-4">
                  Tree is empty. Insert nodes to visualize.
                </div>
              )}

              {searchResult && (
                <Alert variant={searchResult.found ? "default" : "destructive"} className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{searchResult.found ? "Value Found!" : "Value Not Found"}</AlertTitle>
                  <AlertDescription>
                    {searchResult.found
                      ? `The value ${searchValue} was found in the tree.`
                      : `The value ${searchValue} does not exist in the tree.`}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Perform various operations on the binary search tree</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="insert">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insert">Insert</TabsTrigger>
                  <TabsTrigger value="search">Search</TabsTrigger>
                  <TabsTrigger value="delete">Delete</TabsTrigger>
                </TabsList>
                <TabsContent value="insert" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="insert-value">Value</Label>
                        <Input
                          id="insert-value"
                          type="number"
                          placeholder="Enter a number"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <Button onClick={handleInsert} className="w-full mt-8">
                          Insert
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="search" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="search-value">Value</Label>
                        <Input
                          id="search-value"
                          type="number"
                          placeholder="Enter a number"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <Button onClick={handleSearch} className="w-full mt-8">
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="delete" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="delete-value">Value</Label>
                        <Input
                          id="delete-value"
                          type="number"
                          placeholder="Enter a number"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <Button onClick={handleDelete} variant="destructive" className="w-full mt-8">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Time Complexity</CardTitle>
              <CardDescription>Performance characteristics of binary search tree operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Access</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.access}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    O(log n) for balanced trees, O(n) for skewed trees.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Search</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.search}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    O(log n) for balanced trees, O(n) for skewed trees.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Insertion</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.insertion}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    O(log n) for balanced trees, O(n) for skewed trees.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Deletion</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.deletion}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    O(log n) for balanced trees, O(n) for skewed trees.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                BST Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Binary Property:</strong> Each node has at most two children.
                </li>
                <li>\
                  <strong>Search Property:</strong> Left subtree values {"<"} node value {"<"} right subtree values.
                </li>
                <li>
                  <strong>Balanced Trees:</strong> Self-balancing variants like AVL and Red-Black trees maintain O(log n) operations.
                </li>
                <li>
                  <strong>In-order Traversal:</strong> Visits nodes in ascending order of values.
                </li>
                <li>
                  <strong>Applications:</strong> Used in search applications, priority queues, and for maintaining sorted data.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
