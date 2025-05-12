"use client";
import { Card, CardContent } from "@/components/ui/card";
// import { BarChart, LineChart } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTilesInfo } from "@/lib/features/dashboard/dashboard.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Users, FileText, BarChart3, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RootState } from "@/lib/store";
import { RANGES } from "@/lib/constant";
import { fetchUserTests } from "@/lib/features/test/testManagement";
import { convertToDateFormat } from "@/lib/utils";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, LineChart } from "@/app/components/ui/chart";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const accessTokenSelector = useAppSelector(
    (state: RootState) => state.auth.accessToken
  );
  const barChartData = [
    { label: "Easy", value: 75 },
    { label: "Medium", value: 60 },
    { label: "Hard", value: 45 },
  ];
  const accessToken = accessTokenSelector ?? session?.user?.accessToken;
  const tiles = useAppSelector((state: RootState) => state.dashboard.tiles);
  const recentTests = useAppSelector((state: RootState) => state.test.getTests);
  const { testsListing } = recentTests;
  const [range, setRange] = useState("day");

  const data = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 70 },
    { name: 'Apr', value: 85 },
    { name: 'May', value: 50 },
  ];
  const fetchTilesData = async () => {
    await dispatch(fetchTilesInfo({ accessToken, range }));
  };

  const fetchRecentTests = async () => {
    await dispatch(fetchUserTests({ accessToken, search: "", limit: 5 }));
  };

  useEffect(() => {
    if (accessToken) {
      fetchTilesData();
    }
  }, [accessToken, range]);

  useEffect(() => {
    if (accessToken) {
      fetchRecentTests();
    }
  }, [accessToken]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="day">
            <TabsList>
              {RANGES.map((range) => (
                <TabsTrigger
                  className="cursor-pointer"
                  key={range.value}
                  value={range.value}
                  onClick={() => setRange(range.value)}
                >
                  {range.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold mt-1">{tiles.totalUsers}</h3>
                <p className="text-xs text-green-500 mt-1">
                  +12% from last month
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Total Tests Given
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {tiles.totalTestTaken}
                </h3>
                <p className="text-xs text-green-500 mt-1">
                  +8% from last month
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Average Score (All Tests)
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {Number(tiles.averageScore).toFixed(2)}%
                </h3>{" "}
                <p className="text-xs text-red-500 mt-1">-2% from last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card>
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
        </Card> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Average Score by Difficulty
            </h3>
            <div className="h-[300px]">
              <BarChart
                data={barChartData}
                height={300}
                barColor="#6366f1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Test Completion Trend
            </h3>
            <div className="h-[300px]">
              <LineChart
                data={data}
                index="name"
                categories={["value"]}
                colors={["#10b981"]}
                valueFormatter={(value) => `${value}%`}
                yAxisWidth={40}
              />
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
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="text-left py-3 px-4 font-medium">
                      Test ID
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium">
                      Test Name
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium">
                      User Name
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium">
                      Subject
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium">
                      Class
                    </TableHead>
                    <TableHead className="text-left py-3 px-4 font-medium">
                      Questions
                    </TableHead>
                    <th className="text-left py-3 px-4 font-medium">
                      Avg. Score
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testsListing.length > 0 ? (
                    testsListing.map((tests) => (
                      <TableRow key={tests._id} className="border-b">
                        <TableCell className="py-3 px-4">{tests._id}</TableCell>
                        <TableCell className="py-3 px-4">
                          {tests.testName}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {tests.createdBy}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {tests.subjectName}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {tests.className}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {tests.totalQuestions}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {tests.avgScore}%
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {convertToDateFormat(tests.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      {recentTests.loading ? (
                        <TableCell colSpan={10} className="h-24 text-center">
                          Loading...
                        </TableCell>
                      ) : (
                        <TableCell colSpan={10} className="h-24 text-center">
                          No tests found.
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
