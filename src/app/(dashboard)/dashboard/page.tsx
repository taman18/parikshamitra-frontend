"use client"
import { Card, CardContent } from "@/components/ui/card"
// import { BarChart, LineChart } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, BarChart3, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  // Sample data for charts
  const barChartData = [
    { name: "Easy", value: 75 },
    { name: "Medium", value: 65 },
    { name: "Hard", value: 55 },
  ]

  const lineChartData = [
    { name: "Jan", value: 65 },
    { name: "Feb", value: 59 },
    { name: "Mar", value: 80 },
    { name: "Apr", value: 81 },
    { name: "May", value: 56 },
    { name: "Jun", value: 55 },
    { name: "Jul", value: 40 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="day">
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">5,000</h3>
                <p className="text-xs text-green-500 mt-1">+12% from last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tests Given</p>
                <h3 className="text-2xl font-bold mt-1">12,000</h3>
                <p className="text-xs text-green-500 mt-1">+8% from last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score (All Tests)</p>
                <h3 className="text-2xl font-bold mt-1">68.4%</h3>
                <p className="text-xs text-red-500 mt-1">-2% from last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Score by Difficulty</p>
                <h3 className="text-2xl font-bold mt-1">65%</h3>
                <p className="text-xs text-green-500 mt-1">+5% from last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Average Score by Difficulty</h3>
            <div className="h-[300px]">
              {/* <BarChart
                data={barChartData}
                index="name"
                categories={["value"]}
                colors={["#6366f1"]}
                valueFormatter={(value) => `${value}%`}
                yAxisWidth={40}
              /> */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Test Completion Trend</h3>
            <div className="h-[300px]">
              {/* <LineChart
                data={lineChartData}
                index="name"
                categories={["value"]}
                colors={["#10b981"]}
                valueFormatter={(value) => `${value}%`}
                yAxisWidth={40}
              /> */}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Tests</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Test ID</th>
                    <th className="text-left py-3 px-4 font-medium">Subject</th>
                    <th className="text-left py-3 px-4 font-medium">Class</th>
                    <th className="text-left py-3 px-4 font-medium">Questions</th>
                    <th className="text-left py-3 px-4 font-medium">Avg. Score</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">TEST-{1000 + i}</td>
                      <td className="py-3 px-4">Mathematics</td>
                      <td className="py-3 px-4">Class {6 + (i % 6)}</td>
                      <td className="py-3 px-4">{10 + i * 5}</td>
                      <td className="py-3 px-4">{60 + i * 3}%</td>
                      <td className="py-3 px-4">2023-04-{10 + i}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
