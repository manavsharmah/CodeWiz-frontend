"use client"

import { useState, useEffect } from "react"
import { AlertCircle, ArrowRight, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Node {
  value: number
  next: Node | null
}

export default function LinkedListVisualizer() {
  const [head, setHead] = useState<Node | null>(null)
  const [value, setValue] = useState("")
  const [position, setPosition] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState<{ found: boolean; position?: number } | null>(null)
  const [activeNodePosition, setActiveNodePosition] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [listArray, setListArray] = useState<Node[]>([])

  // Convert linked list to array for visualization
  useEffect(() => {
    const arr: Node[] = []
    let current = head
    while (current) {
      arr.push(current)
      current = current.next
    }
    setListArray(arr)
  }, [head])

  const handleAddToHead = () => {
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

    const newNode: Node = {
      value: newValue,
      next: head,
    }

    animateOperation(0, () => {
      setHead(newNode)
      setValue("")
    })
  }

  const handleAddToTail = () => {
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

    const newNode: Node = {
      value: newValue,
      next: null,
    }

    if (!head) {
      animateOperation(0, () => {
        setHead(newNode)
        setValue("")
      })
      return
    }

    let current = head
    let position = 0
    while (current.next) {
      current = current.next
      position++
    }

    animateOperation(position + 1, () => {
      current.next = newNode
      setHead({ ...head }) // Create a new reference to trigger re-render
      setValue("")
    })
  }

  const handleAddAtPosition = () => {
    if (!value || !position) {
      setError("Please enter both value and position")
      return
    }

    const newValue = Number.parseInt(value)
    const posValue = Number.parseInt(position)

    if (isNaN(newValue) || isNaN(posValue)) {
      setError("Please enter valid numbers")
      return
    }

    if (posValue < 0) {
      setError("Position must be non-negative")
      return
    }

    setError(null)

    const newNode: Node = {
      value: newValue,
      next: null,
    }

    // If position is 0, add to head
    if (posValue === 0) {
      newNode.next = head
      animateOperation(0, () => {
        setHead(newNode)
        setValue("")
        setPosition("")
      })
      return
    }

    // If head is null, can't add at position > 0
    if (!head) {
      setError("List is empty. Can only add at position 0.")
      return
    }

    let current = head
    let currentPos = 0

    // Find the node at position - 1
    while (currentPos < posValue - 1 && current.next) {
      current = current.next
      currentPos++
    }

    // If position is beyond the end of the list
    if (currentPos < posValue - 1) {
      setError(`Position ${posValue} is out of bounds. List length is ${currentPos + 1}.`)
      return
    }

    // Insert the new node
    newNode.next = current.next

    animateOperation(currentPos + 1, () => {
      current.next = newNode
      setHead({ ...head }) // Create a new reference to trigger re-render
      setValue("")
      setPosition("")
    })
  }

  const handleRemoveHead = () => {
    if (!head) {
      setError("List is already empty")
      return
    }

    setError(null)

    animateOperation(0, () => {
      setHead(head.next)
    })
  }

  const handleRemoveTail = () => {
    if (!head) {
      setError("List is already empty")
      return
    }

    setError(null)

    // If there's only one node
    if (!head.next) {
      animateOperation(0, () => {
        setHead(null)
      })
      return
    }

    // Find the second-to-last node
    let current = head
    let position = 0
    while (current.next && current.next.next) {
      current = current.next
      position++
    }

    animateOperation(position + 1, () => {
      current.next = null
      setHead({ ...head }) // Create a new reference to trigger re-render
    })
  }

  const handleRemoveAtPosition = () => {
    if (!position) {
      setError("Please enter a position")
      return
    }

    const posValue = Number.parseInt(position)

    if (isNaN(posValue)) {
      setError("Please enter a valid number")
      return
    }

    if (posValue < 0) {
      setError("Position must be non-negative")
      return
    }

    if (!head) {
      setError("List is empty")
      return
    }

    setError(null)

    // If removing head
    if (posValue === 0) {
      animateOperation(0, () => {
        setHead(head.next)
        setPosition("")
      })
      return
    }

    let current = head
    let currentPos = 0

    // Find the node at position - 1
    while (currentPos < posValue - 1 && current.next) {
      current = current.next
      currentPos++
    }

    // If position is beyond the end of the list or the next node doesn't exist
    if (currentPos < posValue - 1 || !current.next) {
      setError(`Position ${posValue} is out of bounds. List length is ${currentPos + (current.next ? 2 : 1)}.`)
      return
    }

    animateOperation(posValue, () => {
      current.next = current.next?.next || null
      setHead({ ...head }) // Create a new reference to trigger re-render
      setPosition("")
    })
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

    // Simulate searching through the linked list
    const current = head
    const position = 0
    const found = false

    // Animate the search process
    const searchAnimation = (currentPos: number, node: Node | null) => {
      if (!node) {
        // Search complete, not found
        setActiveNodePosition(null)
        setSearchResult({ found: false })
        return
      }

      setActiveNodePosition(currentPos)

      setTimeout(() => {
        if (node.value === searchNum) {
          // Found the value
          setActiveNodePosition(currentPos)
          setSearchResult({ found: true, position: currentPos })
        } else {
          // Continue searching
          searchAnimation(currentPos + 1, node.next)
        }
      }, 500)
    }

    setSearchResult(null)
    searchAnimation(0, current)
  }

  const animateOperation = (position: number, callback: () => void) => {
    setActiveNodePosition(position)
    setTimeout(() => {
      setActiveNodePosition(null)
      callback()
    }, 500)
  }

  const timeComplexity = {
    access: "O(n)",
    search: "O(n)",
    insertion: {
      head: "O(1)",
      tail: "O(n)",
      middle: "O(n)",
    },
    deletion: {
      head: "O(1)",
      tail: "O(n)",
      middle: "O(n)",
    },
  }

  return (
    <div className="container mt-10 p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Linked List Visualizer</h1>
        <p className="text-muted-foreground">
          A linked list is a linear data structure where elements are stored in nodes, and each node points to the next
          node in the sequence.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Visual representation of the linked list data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6 min-h-[100px] items-center">
                {listArray.length > 0 ? (
                  listArray.map((node, idx) => (
                    <div key={idx} className="flex items-center">
                      <div
                        className={`flex flex-col items-center ${
                          activeNodePosition === idx
                            ? "animate-pulse bg-primary text-primary-foreground"
                            : searchResult?.position === idx
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-muted"
                        } p-4 rounded-md w-16 h-16 justify-center relative`}
                      >
                        <span className="text-lg font-mono">{node.value}</span>
                        <span className="text-xs text-muted-foreground absolute -bottom-6">{idx}</span>
                      </div>
                      {idx < listArray.length - 1 && <ArrowRight className="mx-1 text-muted-foreground" />}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground italic">Linked list is empty. Add elements to visualize.</div>
                )}
              </div>

              {searchResult && (
                <Alert variant={searchResult.found ? "default" : "destructive"} className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{searchResult.found ? "Element Found!" : "Element Not Found"}</AlertTitle>
                  <AlertDescription>
                    {searchResult.found
                      ? `The value ${searchValue} was found at position ${searchResult.position}.`
                      : `The value ${searchValue} does not exist in the linked list.`}
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
              <CardDescription>Perform various operations on the linked list</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="insert">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insert">Insert</TabsTrigger>
                  <TabsTrigger value="remove">Remove</TabsTrigger>
                  <TabsTrigger value="search">Search</TabsTrigger>
                </TabsList>
                <TabsContent value="insert" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="insert-value">Value</Label>
                        <Input
                          id="insert-value"
                          type="number"
                          placeholder="Enter a number"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleAddToHead} className="w-full mt-8">
                          Add to Head
                        </Button>
                        <Button onClick={handleAddToTail} className="w-full mt-8">
                          Add to Tail
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="insert-value-at-position">Value</Label>
                        <Input
                          id="insert-value-at-position"
                          type="number"
                          placeholder="Enter a number"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insert-position">Position</Label>
                        <Input
                          id="insert-position"
                          type="number"
                          placeholder="Enter position"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        />
                      </div>
                      <div>
                        <Button onClick={handleAddAtPosition} className="w-full mt-8">
                          Add at Position
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="remove" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={handleRemoveHead} className="w-full">
                        Remove Head
                      </Button>
                      <Button onClick={handleRemoveTail} className="w-full">
                        Remove Tail
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="remove-position">Position</Label>
                        <Input
                          id="remove-position"
                          type="number"
                          placeholder="Enter position"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        />
                      </div>
                      <div>
                        <Button onClick={handleRemoveAtPosition} className="w-full mt-8">
                          Remove at Position
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="search" className="space-y-4 pt-4">
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Time Complexity</CardTitle>
              <CardDescription>Performance characteristics of linked list operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Access</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.access}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Accessing an element requires traversing from the head to the desired position.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Search</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.search}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Searching requires traversing the list from the head until the element is found.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Insertion</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">At the head:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.insertion.head}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">At the tail:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.insertion.tail}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">In the middle:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.insertion.middle}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Deletion</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">From the head:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.deletion.head}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">From the tail:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.deletion.tail}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">From the middle:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.deletion.middle}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Linked List Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Dynamic Size:</strong> Linked lists can grow or shrink during execution.
                </li>
                <li>
                  <strong>Non-Contiguous Memory:</strong> Nodes can be stored anywhere in memory.
                </li>
                <li>
                  <strong>Sequential Access:</strong> Elements must be accessed sequentially starting from the head.
                </li>
                <li>
                  <strong>Types:</strong> Singly linked (shown here), doubly linked, and circular linked lists.
                </li>
                <li>
                  <strong>Efficient Insertions/Deletions:</strong> Once a position is found, operations are O(1).
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

