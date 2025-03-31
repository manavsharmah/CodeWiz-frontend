"use client"

import { useState } from "react"
import { AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [value, setValue] = useState("")
  const [index, setIndex] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState<{ found: boolean; index?: number } | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAddToEnd = () => {
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
    const newArray = [...array, newValue]
    animateOperation(newArray.length - 1, () => {
      setArray(newArray)
      setValue("")
    })
  }

  const handleAddAtIndex = () => {
    if (!value || !index) {
      setError("Please enter both value and index")
      return
    }

    const newValue = Number.parseInt(value)
    const indexValue = Number.parseInt(index)

    if (isNaN(newValue) || isNaN(indexValue)) {
      setError("Please enter valid numbers")
      return
    }

    if (indexValue < 0 || indexValue > array.length) {
      setError(`Index must be between 0 and ${array.length}`)
      return
    }

    setError(null)
    const newArray = [...array.slice(0, indexValue), newValue, ...array.slice(indexValue)]
    animateOperation(indexValue, () => {
      setArray(newArray)
      setValue("")
      setIndex("")
    })
  }

  const handleRemoveFromEnd = () => {
    if (array.length === 0) {
      setError("Array is already empty")
      return
    }

    setError(null)
    animateOperation(array.length - 1, () => {
      setArray(array.slice(0, -1))
    })
  }

  const handleRemoveAtIndex = () => {
    if (!index) {
      setError("Please enter an index")
      return
    }

    const indexValue = Number.parseInt(index)

    if (isNaN(indexValue)) {
      setError("Please enter a valid number")
      return
    }

    if (indexValue < 0 || indexValue >= array.length) {
      setError(`Index must be between 0 and ${array.length - 1}`)
      return
    }

    setError(null)
    animateOperation(indexValue, () => {
      const newArray = [...array.slice(0, indexValue), ...array.slice(indexValue + 1)]
      setArray(newArray)
      setIndex("")
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

    // Simulate searching through the array
    let foundIndex = -1

    // Animate the search process
    const searchAnimation = (currentIndex: number) => {
      if (currentIndex >= array.length) {
        // Search complete
        setActiveIndex(null)
        setSearchResult({ found: foundIndex !== -1, index: foundIndex !== -1 ? foundIndex : undefined })
        return
      }

      setActiveIndex(currentIndex)

      setTimeout(() => {
        if (array[currentIndex] === searchNum) {
          foundIndex = currentIndex
          setActiveIndex(null)
          setSearchResult({ found: true, index: currentIndex })
        } else {
          searchAnimation(currentIndex + 1)
        }
      }, 500)
    }

    setSearchResult(null)
    searchAnimation(0)
  }

  const animateOperation = (index: number, callback: () => void) => {
    setActiveIndex(index)
    setTimeout(() => {
      setActiveIndex(null)
      callback()
    }, 500)
  }

  const timeComplexity = {
    access: "O(1)",
    search: "O(n)",
    insertion: {
      end: "O(1)",
      beginning: "O(n)",
      middle: "O(n)",
    },
    deletion: {
      end: "O(1)",
      beginning: "O(n)",
      middle: "O(n)",
    },
  }

  return (
    <div className="container mt-10 p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Array Visualizer</h1>
        <p className="text-muted-foreground">
          An array is a collection of elements stored at contiguous memory locations, each identified by an index.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Visual representation of the array data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6 min-h-[100px] items-center">
                {array.length > 0 ? (
                  array.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col items-center ${
                        activeIndex === idx
                          ? "animate-pulse bg-primary text-primary-foreground"
                          : searchResult?.index === idx
                            ? "bg-green-100 dark:bg-green-900"
                            : "bg-muted"
                      } p-4 rounded-md w-16 h-16 justify-center relative`}
                    >
                      <span className="text-lg font-mono">{item}</span>
                      <span className="text-xs text-muted-foreground absolute -bottom-6">{idx}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground italic">Array is empty. Add elements to visualize.</div>
                )}
              </div>

              {searchResult && (
                <Alert variant={searchResult.found ? "default" : "destructive"} className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{searchResult.found ? "Element Found!" : "Element Not Found"}</AlertTitle>
                  <AlertDescription>
                    {searchResult.found
                      ? `The value ${searchValue} was found at index ${searchResult.index}.`
                      : `The value ${searchValue} does not exist in the array.`}
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
              <CardDescription>Perform various operations on the array</CardDescription>
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
                      <div>
                        <Button onClick={handleAddToEnd} className="w-full mt-8">
                          Add to End
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="insert-value-at-index">Value</Label>
                        <Input
                          id="insert-value-at-index"
                          type="number"
                          placeholder="Enter a number"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insert-index">Index</Label>
                        <Input
                          id="insert-index"
                          type="number"
                          placeholder="Enter index"
                          value={index}
                          onChange={(e) => setIndex(e.target.value)}
                        />
                      </div>
                      <div>
                        <Button onClick={handleAddAtIndex} className="w-full mt-8">
                          Add at Index
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="remove" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Button onClick={handleRemoveFromEnd} className="w-full">
                          Remove from End
                        </Button>
                      </div>
                      <div></div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="remove-index">Index</Label>
                        <Input
                          id="remove-index"
                          type="number"
                          placeholder="Enter index"
                          value={index}
                          onChange={(e) => setIndex(e.target.value)}
                        />
                      </div>
                      <div>
                        <Button onClick={handleRemoveAtIndex} className="w-full mt-8">
                          Remove at Index
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
              <CardDescription>Performance characteristics of array operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Access</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.access}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Arrays provide constant-time access to elements by index.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Search</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.search}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Searching for a value requires checking each element in the worst case.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Insertion</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">At the end:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.insertion.end}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">At the beginning:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.insertion.beginning}
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
                      <span className="text-sm">From the end:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.deletion.end}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">From the beginning:</span>
                      <Badge variant="outline" className="text-sm">
                        {timeComplexity.deletion.beginning}
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
                Array Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Fixed Size:</strong> In many languages, arrays have a fixed size that must be defined at
                  creation.
                </li>
                <li>
                  <strong>Contiguous Memory:</strong> Elements are stored in adjacent memory locations.
                </li>
                <li>
                  <strong>Random Access:</strong> Any element can be accessed directly using its index.
                </li>
                <li>
                  <strong>Homogeneous:</strong> In most languages, arrays store elements of the same data type.
                </li>
                <li>
                  <strong>Zero-Indexed:</strong> In most programming languages, array indices start at 0.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

