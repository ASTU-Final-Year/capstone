"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  GraduationCap,
  TrendingUp,
  PlusCircle,
  UserPlus,
  Activity,
  School,
  Calendar,
  BookOpen,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock data - In a real app, you would fetch this from your API
const mockStudents = [
  {
    id: "1",
    fullname: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    nationalId: "123456789",
    birthDate: "2005-06-15",
    academicYear: "2024",
    gpa: 3.8,
    isActive: true,
    specialNeed: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    fullname: "Jane Smith",
    email: "jane@example.com",
    phone: "+1234567891",
    nationalId: "987654321",
    birthDate: "2005-03-22",
    academicYear: "2024",
    gpa: 3.9,
    isActive: true,
    specialNeed: true,
    createdAt: "2024-01-16T14:45:00Z",
  },
];

const mockAnalytics = {
  totalStudents: 245,
  activeStudents: 230,
  averageGPA: 3.45,
  graduationRate: 92,
  specialNeedsCount: 18,
  yearDistribution: [
    { year: "2024", count: 85 },
    { year: "2023", count: 80 },
    { year: "2022", count: 80 },
  ],
  gpaDistribution: [
    { range: "4.0", count: 15 },
    { range: "3.5-3.9", count: 85 },
    { range: "3.0-3.4", count: 90 },
    { range: "2.5-2.9", count: 40 },
    { range: "Below 2.5", count: 15 },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function SchoolDashboard() {
  const [students, setStudents] = useState(mockStudents);
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullname: "",
    email: "",
    phone: "",
    nationalId: "",
    birthDate: "",
    academicYear: "",
    gender: "",
    password: "",
    gpa: "",
    specialNeed: false,
  });

  // In a real app, you would fetch this data
  const schoolInfo = {
    name: "Central High School",
    code: "CHS-001",
    type: "Public",
    city: "New York",
    totalClasses: 15,
    activeTeachers: 45,
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    // In a real app, you would make an API call here
    // POST /api/students with newStudent data

    // Mock API call
    const mockResponse = {
      id: String(students.length + 1),
      ...newStudent,
      gpa: parseFloat(newStudent.gpa) || 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setStudents([...students, mockResponse]);
    setAnalytics({
      ...analytics,
      totalStudents: analytics.totalStudents + 1,
      activeStudents: analytics.activeStudents + 1,
    });

    setIsAddStudentOpen(false);
    setNewStudent({
      fullname: "",
      email: "",
      phone: "",
      nationalId: "",
      birthDate: "",
      academicYear: "",
      gender: "",
      password: "",
      gpa: "",
      specialNeed: false,
    });

    toast({
      title: "Student Added",
      description: `${newStudent.fullname} has been successfully added.`,
    });
  };

  const handleInputChange = (field, value) => {
    setNewStudent((prev) => ({ ...prev, [field]: value }));
  };

  // Stats cards for overview
  const statsCards = [
    {
      title: "Total Students",
      value: analytics.totalStudents,
      icon: <Users className="h-4 w-4" />,
      description: "Enrolled students",
      color: "bg-blue-500",
    },
    {
      title: "Active Students",
      value: analytics.activeStudents,
      icon: <Activity className="h-4 w-4" />,
      description: "Currently active",
      color: "bg-green-500",
    },
    {
      title: "Average GPA",
      value: analytics.averageGPA.toFixed(2),
      icon: <TrendingUp className="h-4 w-4" />,
      description: "School average",
      color: "bg-purple-500",
    },
    {
      title: "Graduation Rate",
      value: `${analytics.graduationRate}%`,
      icon: <GraduationCap className="h-4 w-4" />,
      description: "Success rate",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              School Dashboard
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <School className="h-5 w-5 text-gray-500" />
              <p className="text-gray-600">
                {schoolInfo.name} • {schoolInfo.code}
              </p>
              <Badge variant="secondary">{schoolInfo.type}</Badge>
            </div>
            <p className="mt-1 text-gray-500">
              {schoolInfo.city} • {schoolInfo.totalClasses} Classes •{" "}
              {schoolInfo.activeTeachers} Teachers
            </p>
          </div>

          <Button
            onClick={() => setIsAddStudentOpen(true)}
            className="mt-4 md:mt-0"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Student
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview">
            <BookOpen className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* GPA Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>GPA Distribution</CardTitle>
                <CardDescription>
                  Student performance distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.gpaDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Year Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Year Distribution</CardTitle>
                <CardDescription>Students by academic year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.yearDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ year, percent }) =>
                          `${year}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.yearDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Student Additions</CardTitle>
              <CardDescription>
                Latest 5 students added to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Added Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.slice(0, 5).map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.fullname}
                      </TableCell>
                      <TableCell>{student.academicYear}</TableCell>
                      <TableCell>{student.gpa}</TableCell>
                      <TableCell>
                        <Badge
                          variant={student.isActive ? "default" : "secondary"}
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(student.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>
                    Manage all students in your school
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button onClick={() => setIsAddStudentOpen(true)} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>National ID</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Special Needs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.fullname}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                        <TableCell>{student.nationalId}</TableCell>
                        <TableCell>{student.academicYear}</TableCell>
                        <TableCell>{student.gpa}</TableCell>
                        <TableCell>
                          {student.specialNeed ? (
                            <Badge variant="destructive">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={student.isActive ? "default" : "secondary"}
                          >
                            {student.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid gap-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Special Needs Students
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.specialNeedsCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Students requiring special attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Graduation Success
                  </CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.graduationRate}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Successful graduation rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Year Over Year Growth
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+6.2%</div>
                  <p className="text-xs text-muted-foreground">
                    Student population growth
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Student Enrollment Trend</CardTitle>
                  <CardDescription>
                    Monthly student enrollment for current year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Jan", students: 230 },
                          { month: "Feb", students: 235 },
                          { month: "Mar", students: 240 },
                          { month: "Apr", students: 242 },
                          { month: "May", students: 245 },
                          { month: "Jun", students: 245 },
                          { month: "Jul", students: 248 },
                          { month: "Aug", students: 250 },
                          { month: "Sep", students: 255 },
                          { month: "Oct", students: 260 },
                          { month: "Nov", students: 265 },
                          { month: "Dec", students: 270 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="students"
                          stroke="#8884d8"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance</CardTitle>
                  <CardDescription>GPA distribution by year</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Academic Year</TableHead>
                        <TableHead>Avg GPA</TableHead>
                        <TableHead>Top 10% GPA</TableHead>
                        <TableHead>Pass Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2024</TableCell>
                        <TableCell>3.45</TableCell>
                        <TableCell>3.95</TableCell>
                        <TableCell>94%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023</TableCell>
                        <TableCell>3.42</TableCell>
                        <TableCell>3.92</TableCell>
                        <TableCell>93%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2022</TableCell>
                        <TableCell>3.38</TableCell>
                        <TableCell>3.89</TableCell>
                        <TableCell>91%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Status Overview</CardTitle>
                  <CardDescription>
                    Current student status distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Active", value: analytics.activeStudents },
                            {
                              name: "Inactive",
                              value:
                                analytics.totalStudents -
                                analytics.activeStudents,
                            },
                            { name: "Graduated", value: 45 },
                            { name: "Transferred", value: 12 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#0088FE" />
                          <Cell fill="#00C49F" />
                          <Cell fill="#FFBB28" />
                          <Cell fill="#FF8042" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Student Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Fill in the student's information. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    value={newStudent.fullname}
                    onChange={(e) =>
                      handleInputChange("fullname", e.target.value)
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newStudent.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID</Label>
                  <Input
                    id="nationalId"
                    value={newStudent.nationalId}
                    onChange={(e) =>
                      handleInputChange("nationalId", e.target.value)
                    }
                    placeholder="123456789"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={newStudent.birthDate}
                    onChange={(e) =>
                      handleInputChange("birthDate", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={newStudent.academicYear}
                    onValueChange={(value) =>
                      handleInputChange("academicYear", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={newStudent.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={newStudent.gpa}
                    onChange={(e) => handleInputChange("gpa", e.target.value)}
                    placeholder="3.8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newStudent.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Create a temporary password"
                  required
                />
                <p className="text-sm text-gray-500">
                  Student will be prompted to change this on first login
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="specialNeed"
                  checked={newStudent.specialNeed}
                  onChange={(e) =>
                    handleInputChange("specialNeed", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="specialNeed">Special Needs Student</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddStudentOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Student</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
