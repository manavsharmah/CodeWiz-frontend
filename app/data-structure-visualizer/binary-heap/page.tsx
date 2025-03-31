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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function BinaryHeapVisualizer() {
  const [heap, setHeap] = useState<number[]>([])
  const [value, setValue] = useState("")
  const [heapType, setHeapType] = useState<"min" | "max">("min")
  const [activeIndices, setActiveIndices] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 })

  // Resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        setCanvasSize({
          width: container.clientWidth,
          height: Math.max(400, container.clientWidth * 0.6),
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Draw the heap on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (heap.length === 0) return

    const nodeRadius = 20
    const levelHeight = 70

    // Calculate positions for each node
    const positions: { x: number; y: number }[] = []

    for (let i = 0; i < heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1))
      const nodesInLevel = Math.pow(2, level)
      const position = i - Math.pow(2, level) + 1

      const x = (canvas.width * (position + 0.5)) / nodesInLevel
      const y = level * levelHeight + 50

      positions[i] = { x, y }
    }

    // Draw edges
    ctx.strokeStyle = "#888"
    ctx.lineWidth = 1.5

    for (let i = 0; i < heap.length; i++) {
      const leftChildIndex = 2 * i + 1
      const rightChildIndex = 2 * i + 2

      if (leftChildIndex < heap.length) {
        ctx.beginPath()
        ctx.moveTo(positions[i].x, positions[i].y)
        ctx.lineTo(positions[leftChildIndex].x, positions[leftChildIndex].y)
        ctx.stroke()
      }

      if (rightChildIndex < heap.length) {
        ctx.beginPath()
        ctx.moveTo(positions[i].x, positions[i].y)
        ctx.lineTo(positions[rightChildIndex].x, positions[rightChildIndex].y)
        ctx.stroke()
      }
    }

    // Draw nodes
    for (let i = 0; i < heap.length; i++) {
      ctx.beginPath()
      ctx.arc(positions[i].x, positions[i].y, nodeRadius, 0, Math.PI * 2)

      if (activeIndices.includes(i)) {
        ctx.fillStyle = "hsl(var(--primary))"
      } else {
        ctx.fillStyle = "hsl(var(--muted))"
      }

      ctx.fill()
      ctx.stroke()

      // Draw value
      ctx.fillStyle = activeIndices.includes(i) ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = "14px sans-serif"
      ctx.fillText(heap[i].toString(), positions[i].x, positions[i].y)
    }
  }, [heap, activeIndices, canvasSize])

  const getParentIndex = (index: number) => Math.floor((index - 1) / 2)
  const getLeftChildIndex = (index: number) => 2 * index + 1
  const getRightChildIndex = (index: number) => 2 * index + 2

  const shouldSwap = (parentIndex: number, childIndex: number) => {
    if (heapType === "min") {
      return heap[parentIndex] > heap[childIndex]
    } else {
      return heap[parentIndex] < heap[childIndex]
    }
  }

  const heapifyUp = async (index: number) => {
    let currentIndex = index

    while (currentIndex > 0) {
      const parentIndex = getParentIndex(currentIndex)

      if (!shouldSwap(parentIndex, currentIndex)) break

      // Highlight nodes being compared
      setActiveIndices([parentIndex, currentIndex])

      // Wait to visualize the comparison
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Swap
      const newHeap = [...heap]
      ;[newHeap[parentIndex], newHeap[currentIndex]] = [newHeap[currentIndex], newHeap[parentIndex]]
      setHeap(newHeap)

      // Move up
      currentIndex = parentIndex
    }

    setActiveIndices([])
  }

  const heapifyDown = async (index: number) => {
    let currentIndex = index
    let swapIndex

    while (true) {
      const leftChildIndex = getLeftChildIndex(currentIndex)
      const rightChildIndex = getRightChildIndex(currentIndex)
      const heapSize = heap.length

      swapIndex = currentIndex

      // Check if left child should be swapped
      if (leftChildIndex < heapSize && shouldSwap(swapIndex, leftChildIndex)) {
        swapIndex = leftChildIndex
      }

      // Check if right child should be swapped
      if (rightChildIndex < heapSize && shouldSwap(swapIndex, rightChildIndex)) {
        swapIndex = rightChildIndex
      }

      // If no swap needed, break
      if (swapIndex === currentIndex) break

      // Highlight nodes being compared
      setActiveIndices([currentIndex, swapIndex])

      // Wait to visualize the comparison
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Swap
      const newHeap = [...heap]
      ;[newHeap[currentIndex], newHeap[swapIndex]] = [newHeap[swapIndex], newHeap[currentIndex]]
      setHeap(newHeap)

      // Move down
      currentIndex = swapIndex
    }

    setActiveIndices([])
  }

  const handleInsert = async () => {
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
    setMessage(null)

    // Add the new value to the end of the heap
    const newHeap = [...heap, newValue]
    setHeap(newHeap)
    setValue("")

    // Heapify up from the newly added element
    await heapifyUp(newHeap.length - 1)

    setMessage(`Inserted ${newValue} into the ${heapType} heap`)
  }

  const handleExtract = async () => {
    if (heap.length === 0) {
      setError("Heap is empty")
      return
    }

    setError(null)
    setMessage(null)

    // Store the root value
    const extractedValue = heap[0]

    // If there's only one element, remove it
    if (heap.length === 1) {
      setHeap([])
      setMessage(`Extracted ${extractedValue} from the ${heapType} heap`)
      return
    }

    // Replace the root with the last element
    const newHeap = [...heap]
    newHeap[0] = newHeap[newHeap.length - 1]
    newHeap.pop()
    setHeap(newHeap)

    // Heapify down from the root
    await heapifyDown(0)

    setMessage(`Extracted ${extractedValue} from the ${heapType} heap`)
  }

  const handleClear = () => {
    setHeap([])
    setError(null)
    setMessage(null)
    setActiveIndices([])
  }

  const handleHeapTypeChange = (type: "min" | "max") => {
    if (type === heapType) return

    setHeapType(type)

    // Rebuild the heap with the new type
    if (heap.length > 0) {
      const values = [...heap]
      setHeap([])

      // Schedule rebuilding for the next tick
      setTimeout(() => {
        const rebuildHeap = async () => {
          const newHeap: number[] = []

          for (const value of values) {
            newHeap.push(value)
            setHeap([...newHeap])
            await heapifyUp(newHeap.length - 1)
          }
        }

        rebuildHeap()
      }, 0)
    }
  }

  const timeComplexity = {
    insert: "O(log n)",
    extractMin: "O(log n)",
    findMin: "O(1)",
    heapify: "O(n)",
  }

  return (
    <div className="container mt-10 p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Binary Heap Visualizer</h1>
        <p className="text-muted-foreground">
          A binary heap is a complete binary tree where the value of each node is either greater than or equal to
          (max-heap) or less than or equal to (min-heap) the values of its children.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Visual representation of the binary heap data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto">
                <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} className="mx-auto" />
              </div>

              {heap.length === 0 && (
                <div className="text-center text-muted-foreground italic mt-4">
                  Heap is empty. Insert elements to visualize.
                </div>
              )}

              {message && (
                <Alert className="mt-4">
                  <AlertDescription>{message}</AlertDescription>
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
              <CardDescription>Perform various operations on the binary heap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label className="mb-2 block">Heap Type</Label>
                <RadioGroup
                  defaultValue={heapType}
                  className="flex space-x-4"
                  onValueChange={(value) => handleHeapTypeChange(value as "min" | "max")}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="min" id="min-heap" />
                    <Label htmlFor="min-heap">Min Heap</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="max" id="max-heap" />
                    <Label htmlFor="max-heap">Max Heap</Label>
                  </div>
                </RadioGroup>
              </div>

              <Tabs defaultValue="insert">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insert">Insert</TabsTrigger>
                  <TabsTrigger value="extract">Extract</TabsTrigger>
                  <TabsTrigger value="clear">Clear</TabsTrigger>
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
                <TabsContent value="extract" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <Button onClick={handleExtract}>Extract {heapType === "min" ? "Min" : "Max"}</Button>
                    <div className="text-sm text-muted-foreground">
                      This operation removes and returns the {heapType === "min" ? "minimum" : "maximum"} element from
                      the heap.
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="clear" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <Button onClick={handleClear} variant="destructive">
                      Clear Heap
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      This operation removes all elements from the heap.
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
              <CardDescription>Performance characteristics of binary heap operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Insert</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.insert}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Adding a new element requires heapifying up from the inserted position.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Extract Min/Max</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.extractMin}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Removing the root element requires heapifying down from the root.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Find Min/Max</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.findMin}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    The minimum (or maximum) element is always at the root.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Build Heap</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.heapify}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Converting an array into a heap by heapifying all non-leaf nodes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Binary Heap Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Complete Binary Tree:</strong> All levels are filled except possibly the last, which is filled
                  from left to right.
                </li>
                <li>
                  <strong>Types:</strong> Min-heap (parent ≤ children) and Max-heap (parent ≥ children).
                </li>
                <li>
                  <strong>Array Representation:</strong> For a node at index i, its children are at 2i+1 and 2i+2, and
                  its parent is at ⌊(i-1)/2⌋.
                </li>
                <li>
                  <strong>Applications:</strong> Priority queues, heap sort, graph algorithms like Dijkstra's and
                  Prim's.
                </li>
                <li>
                  <strong>Efficient Priority Access:</strong> Always provides O(1) access to the minimum/maximum
                  element.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

