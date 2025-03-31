"use client"

import { useState } from "react"
import { AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface HashTableEntry {
  key: string
  value: string
}

export default function HashTableVisualizer() {
  const tableSize = 10
  const [table, setTable] = useState<(HashTableEntry[] | null)[]>(Array(tableSize).fill(null))
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [searchResult, setSearchResult] = useState<{ found: boolean; value?: string; index?: number } | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [collisions, setCollisions] = useState(0)

  // Simple hash function
  const hash = (key: string): number => {
    let hashValue = 0
    for (let i = 0; i < key.length; i++) {
      hashValue += key.charCodeAt(i)
    }
    return hashValue % tableSize
  }

  const handleInsert = () => {
    if (!key || !value) {
      setError("Please enter both key and value")
      return
    }

    setError(null)

    const index = hash(key)
    const newTable = [...table]

    // Check if this key already exists
    if (newTable[index]) {
      const existingEntryIndex = newTable[index]!.findIndex((entry) => entry.key === key)
      if (existingEntryIndex !== -1) {
        // Update existing key
        animateOperation(index, () => {
          newTable[index]![existingEntryIndex] = { key, value }
          setTable(newTable)
          setKey("")
          setValue("")
        })
        return
      }

      // Handle collision - add to chain
      setCollisions((prev) => prev + 1)
    } else {
      newTable[index] = []
    }

    animateOperation(index, () => {
      newTable[index]!.push({ key, value })
      setTable(newTable)
      setKey("")
      setValue("")
    })
  }

  const handleSearch = () => {
    if (!searchKey) {
      setError("Please enter a key to search")
      return
    }

    setError(null)

    const index = hash(searchKey)

    // Animate the search process
    setActiveIndex(index)

    setTimeout(() => {
      if (!table[index]) {
        setActiveIndex(null)
        setSearchResult({ found: false })
        return
      }

      const entry = table[index]!.find((e) => e.key === searchKey)

      if (entry) {
        setSearchResult({ found: true, value: entry.value, index })
      } else {
        setSearchResult({ found: false, index })
      }

      setActiveIndex(null)
    }, 500)
  }

  const handleDelete = () => {
    if (!searchKey) {
      setError("Please enter a key to delete")
      return
    }

    setError(null)

    const index = hash(searchKey)

    if (!table[index]) {
      setError(`No entries found at index ${index}`)
      return
    }

    const entryIndex = table[index]!.findIndex((e) => e.key === searchKey)

    if (entryIndex === -1) {
      setError(`Key "${searchKey}" not found in the hash table`)
      return
    }

    animateOperation(index, () => {
      const newTable = [...table]
      newTable[index]!.splice(entryIndex, 1)

      // If the bucket is now empty, set it to null
      if (newTable[index]!.length === 0) {
        newTable[index] = null
      }

      setTable(newTable)
      setSearchKey("")
      setSearchResult(null)
    })
  }

  const animateOperation = (index: number, callback: () => void) => {
    setActiveIndex(index)
    setTimeout(() => {
      setActiveIndex(null)
      callback()
    }, 500)
  }

  const timeComplexity = {
    access: "O(1) - O(n)",
    search: "O(1) - O(n)",
    insertion: "O(1) - O(n)",
    deletion: "O(1) - O(n)",
  }

  return (
    <div className="container mt-10 p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hash Table Visualizer</h1>
        <p className="text-muted-foreground">
          A hash table is a data structure that maps keys to values using a hash function to compute an index into an
          array of buckets.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Visual representation of the hash table data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 mb-6">
                {table.map((bucket, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 p-3 rounded-md ${
                      activeIndex === idx
                        ? "bg-primary/20 border border-primary"
                        : searchResult?.index === idx
                          ? "bg-green-100 dark:bg-green-900/20 border border-green-500"
                          : "bg-muted"
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-secondary rounded-md font-mono">
                      {idx}
                    </div>
                    <div className="flex-1 flex flex-wrap gap-2">
                      {bucket ? (
                        bucket.map((entry, entryIdx) => (
                          <div key={entryIdx} className="bg-background border rounded-md p-2 flex items-center gap-2">
                            <span className="font-mono text-sm">{entry.key}</span>
                            <span className="text-muted-foreground">:</span>
                            <span className="font-mono text-sm">{entry.value}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic">Empty</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="text-sm">
                  Table Size: {tableSize}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Collisions: {collisions}
                </Badge>
              </div>

              {searchResult && (
                <Alert variant={searchResult.found ? "default" : "destructive"} className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{searchResult.found ? "Key Found!" : "Key Not Found"}</AlertTitle>
                  <AlertDescription>
                    {searchResult.found
                      ? `The key "${searchKey}" was found with value "${searchResult.value}" at index ${searchResult.index}.`
                      : `The key "${searchKey}" does not exist in the hash table.`}
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
              <CardDescription>Perform various operations on the hash table</CardDescription>
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
                        <Label htmlFor="insert-key">Key</Label>
                        <Input
                          id="insert-key"
                          placeholder="Enter a key"
                          value={key}
                          onChange={(e) => setKey(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insert-value">Value</Label>
                        <Input
                          id="insert-value"
                          placeholder="Enter a value"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={handleInsert}>Insert</Button>
                  </div>
                </TabsContent>
                <TabsContent value="search" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="search-key">Key</Label>
                      <Input
                        id="search-key"
                        placeholder="Enter a key"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSearch}>Search</Button>
                  </div>
                </TabsContent>
                <TabsContent value="delete" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="delete-key">Key</Label>
                      <Input
                        id="delete-key"
                        placeholder="Enter a key"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleDelete} variant="destructive">
                      Delete
                    </Button>
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
              <CardDescription>Performance characteristics of hash table operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Access</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.access}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    O(1) in the best case, O(n) in the worst case due to collisions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Search</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.search}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    O(1) in the best case, O(n) in the worst case due to collisions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Insertion</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.insertion}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    O(1) in the best case, O(n) in the worst case due to collisions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Deletion</h3>
                  <Badge variant="outline" className="text-sm">
                    {timeComplexity.deletion}
                  </Badge>
                  <p className="text-sm mt-1 text-muted-foreground">
                    O(1) in the best case, O(n) in the worst case due to collisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Hash Table Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Hash Function:</strong> Converts keys into array indices for efficient lookup.
                </li>
                <li>
                  <strong>Collision Resolution:</strong> This implementation uses chaining (linked lists at each index).
                </li>
                <li>
                  <strong>Load Factor:</strong> The ratio of entries to table size, affects performance.
                </li>
                <li>
                  <strong>Applications:</strong> Used in database indexing, caches, and symbol tables.
                </li>
                <li>
                  <strong>Rehashing:</strong> When load factor exceeds a threshold, the table is resized and entries are
                  rehashed.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

