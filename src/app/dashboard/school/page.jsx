"use client";
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'recharts';
import {
  Users,
  GraduationCap,
  TrendingUp,
  PlusCircle,
  UserPlus,
  School,
  BookOpen,
  FileText,
  CheckCircle,
  Edit,
  Eye,
  Send,
  Calendar,
  AlertCircle,
  Download
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

// Mock data aligned with EAES project requirements
const mockStudents = [
  {
    id: '1',
    fullname: 'John Doe',
    email: 'john@example.com',
    phone: '+251911234567',
    nationalId: '123456789',
    birthDate: '2005-06-15',
    academicYear: '2024',
    gpa: 3.8,
    verificationStatus: 'Verified',
    isSubmitted: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    fullname: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+251911234568',
    nationalId: '987654321',
    birthDate: '2005-03-22',
    academicYear: '2024',
    gpa: 3.9,
    verificationStatus: 'Verified',
    isSubmitted: true,
    createdAt: '2024-01-16T14:45:00Z'
  },
  {
    id: '3',
    fullname: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '+251911234569',
    nationalId: '456789123',
    birthDate: '2005-08-10',
    academicYear: '2024',
    gpa: 3.5,
    verificationStatus: 'Pending',
    isSubmitted: false,
    createdAt: '2024-01-17T09:15:00Z'
  },
];

const mockPlacements = [
  {
    studentId: '1',
    studentName: 'John Doe',
    university: 'Addis Ababa University',
    program: 'Computer Science',
    placementDate: '2024-06-15',
    status: 'Placed'
  },
  {
    studentId: '2',
    studentName: 'Jane Smith',
    university: 'Jimma University',
    program: 'Medicine',
    placementDate: '2024-06-15',
    status: 'Placed'
  },
  {
    studentId: '4',
    studentName: 'Sarah Williams',
    university: 'Hawassa University',
    program: 'Engineering',
    placementDate: '2024-06-15',
    status: 'Placed'
  },
];

const mockSchoolProfile = {
  name: 'Central High School',
  schoolId: 'CHS-001',
  type: 'Public',
  region: 'Addis Ababa',
  city: 'Addis Ababa',
  principalName: 'Dr. Alemayehu Bekele',
  phone: '+251-11-1234567',
  email: 'centralhs@edu.et',
  totalStudents: 245,
  submittedStudents: 230,
  verifiedStudents: 200,
  placedStudents: 0,
  submissionDeadline: '2024-04-30',
  placementReleaseDate: '2024-06-15'
};

export default function SchoolDashboard() {
  const [students, setStudents] = useState(mockStudents);
  const [placements, setPlacements] = useState(mockPlacements);
  const [schoolProfile, setSchoolProfile] = useState(mockSchoolProfile);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSubmitAllOpen, setIsSubmitAllOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullname: '',
    email: '',
    phone: '',
    nationalId: '',
    birthDate: '',
    academicYear: '2024',
    gender: '',
    gpa: '',
    specialNeed: false,
  });
  const [editedProfile, setEditedProfile] = useState({ ...schoolProfile });
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Stats cards for overview
  const statsCards = [
    {
      title: 'Total Students',
      value: schoolProfile.totalStudents,
      icon: <Users className="h-4 w-4" />,
      description: 'Registered students',
      color: 'bg-blue-500',
      trend: '+12 this month'
    },
    {
      title: 'Verified & Ready',
      value: schoolProfile.verifiedStudents,
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Ready for EAES submission',
      color: 'bg-green-500',
      trend: `${Math.round((schoolProfile.verifiedStudents / schoolProfile.totalStudents) * 100)}% complete`
    },
    {
      title: 'Submitted to EAES',
      value: schoolProfile.submittedStudents,
      icon: <FileText className="h-4 w-4" />,
      description: 'Final submission complete',
      color: 'bg-purple-500',
      trend: 'Awaiting placement'
    },
    {
      title: 'Placement Date',
      value: format(new Date(schoolProfile.placementReleaseDate), 'MMM dd'),
      icon: <Calendar className="h-4 w-4" />,
      description: 'Expected release',
      color: 'bg-orange-500',
      trend: 'All students placed together'
    },
  ];

  const handleAddStudent = async (e) => {
    e.preventDefault();

    const mockResponse = {
      id: String(students.length + 1),
      ...newStudent,
      gpa: parseFloat(newStudent.gpa) || 0,
      verificationStatus: 'Pending',
      isSubmitted: false,
      createdAt: new Date().toISOString(),
    };

    setStudents([...students, mockResponse]);
    setSchoolProfile({
      ...schoolProfile,
      totalStudents: schoolProfile.totalStudents + 1
    });

    setIsAddStudentOpen(false);
    setNewStudent({
      fullname: '',
      email: '',
      phone: '',
      nationalId: '',
      birthDate: '',
      academicYear: '2024',
      gender: '',
      gpa: '',
      specialNeed: false,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSchoolProfile(editedProfile);
    setIsEditProfileOpen(false);
  };

  const handleSubmitAllToEAES = () => {
    // Submit all verified students to EAES
    const verifiedStudents = students.filter(s => s.verificationStatus === 'Verified' && !s.isSubmitted);

    // Update student submission status
    const updatedStudents = students.map(student =>
      student.verificationStatus === 'Verified' && !student.isSubmitted
        ? { ...student, isSubmitted: true }
        : student
    );

    setStudents(updatedStudents);

    // Update school profile stats
    setSchoolProfile(prev => ({
      ...prev,
      submittedStudents: prev.submittedStudents + verifiedStudents.length
    }));

    setIsSubmitAllOpen(false);
    alert(`Successfully submitted ${verifiedStudents.length} students to EAES`);
  };

  const handleToggleStudentSelection = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmitSelected = () => {
    const selectedVerified = students.filter(
      s => selectedStudents.includes(s.id) && s.verificationStatus === 'Verified' && !s.isSubmitted
    );

    const updatedStudents = students.map(student =>
      selectedStudents.includes(student.id) && student.verificationStatus === 'Verified' && !student.isSubmitted
        ? { ...student, isSubmitted: true }
        : student
    );

    setStudents(updatedStudents);
    setSchoolProfile(prev => ({
      ...prev,
      submittedStudents: prev.submittedStudents + selectedVerified.length
    }));

    setSelectedStudents([]);
    alert(`Submitted ${selectedVerified.length} selected students to EAES`);
  };

  const handleInputChange = (field, value) => {
    setNewStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileChange = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  // Calculate verification progress
  const verificationProgress = Math.round((schoolProfile.verifiedStudents / schoolProfile.totalStudents) * 100);
  const submissionProgress = Math.round((schoolProfile.submittedStudents / schoolProfile.totalStudents) * 100);

  // Check if placements are released
  const placementsReleased = new Date() >= new Date(schoolProfile.placementReleaseDate);
  const canSubmitToEAES = students.some(s => s.verificationStatus === 'Verified' && !s.isSubmitted);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EAES School Portal</h1>
            <div className="mt-2 flex items-center gap-2">
              <School className="h-5 w-5 text-gray-500" />
              <p className="text-gray-600">{schoolProfile.name} • ID: {schoolProfile.schoolId}</p>
              <Badge variant="secondary">{schoolProfile.type}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>{schoolProfile.region}, {schoolProfile.city}</span>
              <span>• Principal: {schoolProfile.principalName}</span>
              <span>• Submission Deadline: {format(new Date(schoolProfile.submissionDeadline), 'MMM dd, yyyy')}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button
              onClick={() => setIsAddStudentOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">
            <BookOpen className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="placements">
            <GraduationCap className="mr-2 h-4 w-4" />
            Placements
          </TabsTrigger>
          <TabsTrigger value="profile">
            <School className="mr-2 h-4 w-4" />
            Profile
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
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Verification Progress</CardTitle>
                <CardDescription>
                  Student data verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Verified: {schoolProfile.verifiedStudents} students</span>
                    <span>{verificationProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${verificationProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Students must verify their data before EAES submission
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>EAES Submission Progress</CardTitle>
                <CardDescription>
                  Data submission to EAES for placement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Submitted: {schoolProfile.submittedStudents} students</span>
                    <span>{submissionProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${submissionProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Deadline: {format(new Date(schoolProfile.submissionDeadline), 'MMM dd, yyyy')}
                    </span>
                    {canSubmitToEAES && (
                      <Button
                        size="sm"
                        onClick={() => setIsSubmitAllOpen(true)}
                        className="ml-2"
                      >
                        <Send className="mr-2 h-3 w-3" />
                        Submit to EAES
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Placement Status */}
          <Card>
            <CardHeader>
              <CardTitle>Placement Timeline</CardTitle>
              <CardDescription>
                All students will receive placements simultaneously
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Placement Release Date</h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(schoolProfile.placementReleaseDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={placementsReleased ? "default" : "secondary"}>
                    {placementsReleased ? 'Released' : 'Pending'}
                  </Badge>
                </div>

                {placementsReleased ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Placements Released!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      All eligible students have received their university placements.
                      Check the Placements tab for details.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Placements Pending</span>
                    </div>
                    <p className="text-sm text-yellow-600 mt-1">
                      Placements will be released for all students on {format(new Date(schoolProfile.placementReleaseDate), 'MMMM dd, yyyy')}.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest student verification and submission activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.slice(0, 5).map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.fullname}</TableCell>
                      <TableCell>
                        {student.isSubmitted ? 'EAES Submission' :
                          student.verificationStatus === 'Verified' ? 'Student Verification' : 'Data Entry'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          student.isSubmitted ? "default" :
                            student.verificationStatus === 'Verified' ? "success" : "secondary"
                        }>
                          {student.isSubmitted ? 'Submitted' : student.verificationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(student.createdAt), 'MMM dd, yyyy')}
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>
                    Register and manage student data for EAES placement
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {selectedStudents.length > 0 && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSubmitSelected}
                      disabled={!selectedStudents.some(id =>
                        students.find(s => s.id === id)?.verificationStatus === 'Verified' &&
                        !students.find(s => s.id === id)?.isSubmitted
                      )}
                    >
                      <Send className="mr-2 h-3 w-3" />
                      Submit Selected ({selectedStudents.length})
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsSubmitAllOpen(true)}
                    size="sm"
                    disabled={!canSubmitToEAES}
                  >
                    <FileText className="mr-2 h-3 w-3" />
                    Submit All Verified
                  </Button>
                  <Button
                    onClick={() => setIsAddStudentOpen(true)}
                    size="sm"
                  >
                    <PlusCircle className="mr-2 h-3 w-3" />
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
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents(students.map(s => s.id));
                            } else {
                              setSelectedStudents([]);
                            }
                          }}
                          checked={selectedStudents.length === students.length && students.length > 0}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>National ID</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>EAES Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleToggleStudentSelection(student.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{student.fullname}</TableCell>
                        <TableCell>{student.nationalId}</TableCell>
                        <TableCell>{student.academicYear}</TableCell>
                        <TableCell>{student.gpa}</TableCell>
                        <TableCell>
                          <Badge variant={
                            student.verificationStatus === 'Verified' ? "default" :
                              student.verificationStatus === 'Pending' ? "secondary" : "destructive"
                          }>
                            {student.verificationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.isSubmitted ? "default" : "outline"}>
                            {student.isSubmitted ? 'Submitted' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Student Status Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Verified & Submitted', value: schoolProfile.submittedStudents },
                        { name: 'Verified (Not Submitted)', value: schoolProfile.verifiedStudents - schoolProfile.submittedStudents },
                        { name: 'Pending Verification', value: schoolProfile.totalStudents - schoolProfile.verifiedStudents },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10B981" />
                      <Cell fill="#3B82F6" />
                      <Cell fill="#6B7280" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placements Tab */}
        <TabsContent value="placements">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Placements</CardTitle>
                  <CardDescription>
                    {placementsReleased
                      ? 'Placement results released by EAES'
                      : `Placements will be released on ${format(new Date(schoolProfile.placementReleaseDate), 'MMMM dd, yyyy')}`}
                  </CardDescription>
                </div>
                {placementsReleased && placements.length > 0 && (
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {placementsReleased ? (
                <>
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <GraduationCap className="h-5 w-5" />
                      <span className="font-medium">Placements Released!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      All students have been placed simultaneously. Results were released on {format(new Date(schoolProfile.placementReleaseDate), 'MMMM dd, yyyy')}.
                    </p>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>University</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Placement Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {placements.map((placement) => (
                          <TableRow key={placement.studentId}>
                            <TableCell className="font-medium">{placement.studentName}</TableCell>
                            <TableCell>{placement.university}</TableCell>
                            <TableCell>{placement.program}</TableCell>
                            <TableCell>
                              {format(new Date(placement.placementDate), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">
                                {placement.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Placement Statistics */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Placement Distribution</CardTitle>
                      <CardDescription>University placement statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { university: 'Addis Ababa University', count: 45 },
                            { university: 'Jimma University', count: 35 },
                            { university: 'Hawassa University', count: 25 },
                            { university: 'Bahir Dar University', count: 20 },
                            { university: 'Mekelle University', count: 15 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="university" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10B981" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Placements Pending
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    All student placements will be released simultaneously by EAES on{' '}
                    <span className="font-semibold">
                      {format(new Date(schoolProfile.placementReleaseDate), 'MMMM dd, yyyy')}
                    </span>.
                    Check back after this date to view placement results.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* School Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>School Profile</CardTitle>
                  <CardDescription>
                    View and edit your school information
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">School Information</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">School Name:</span> {schoolProfile.name}</p>
                      <p><span className="font-medium">School ID:</span> {schoolProfile.schoolId}</p>
                      <p><span className="font-medium">Type:</span> {schoolProfile.type}</p>
                      <p><span className="font-medium">Region:</span> {schoolProfile.region}</p>
                      <p><span className="font-medium">City:</span> {schoolProfile.city}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Principal:</span> {schoolProfile.principalName}</p>
                      <p><span className="font-medium">Phone:</span> {schoolProfile.phone}</p>
                      <p><span className="font-medium">Email:</span> {schoolProfile.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">EAES Timeline</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Submission Deadline:</span> {format(new Date(schoolProfile.submissionDeadline), 'MMM dd, yyyy')}</p>
                      <p><span className="font-medium">Placement Release:</span> {format(new Date(schoolProfile.placementReleaseDate), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Submission Status</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Total Students:</span> {schoolProfile.totalStudents}</p>
                      <p><span className="font-medium">Verified Students:</span> {schoolProfile.verifiedStudents}</p>
                      <p><span className="font-medium">Submitted to EAES:</span> {schoolProfile.submittedStudents}</p>
                      <p><span className="font-medium">Placements Released:</span> {placementsReleased ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Student Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Student</DialogTitle>
            <DialogDescription>
              Enter student information for EAES placement system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name *</Label>
                  <Input
                    id="fullname"
                    value={newStudent.fullname}
                    onChange={(e) => handleInputChange('fullname', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newStudent.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+251911234567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID *</Label>
                  <Input
                    id="nationalId"
                    value={newStudent.nationalId}
                    onChange={(e) => handleInputChange('nationalId', e.target.value)}
                    placeholder="123456789"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={newStudent.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Select
                    value={newStudent.academicYear}
                    onValueChange={(value) => handleInputChange('academicYear', value)}
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
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={newStudent.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
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
                  <Label htmlFor="gpa">GPA *</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={newStudent.gpa}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    placeholder="3.8"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="specialNeed"
                  checked={newStudent.specialNeed}
                  onChange={(e) => handleInputChange('specialNeed', e.target.checked)}
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
              <Button type="submit">Register Student</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Submit All Dialog */}
      <Dialog open={isSubmitAllOpen} onOpenChange={setIsSubmitAllOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit to EAES</DialogTitle>
            <DialogDescription>
              Submit verified student data to EAES for placement
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Important Information</span>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                • All students will receive placements simultaneously on the release date<br />
                • Only verified students can be submitted<br />
                • Submissions are final and cannot be edited<br />
                • Placements will be released on {format(new Date(schoolProfile.placementReleaseDate), 'MMMM dd, yyyy')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Verified & Ready Students</span>
                <span className="font-bold text-blue-600">
                  {students.filter(s => s.verificationStatus === 'Verified' && !s.isSubmitted).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Already Submitted</span>
                <span className="font-bold text-green-600">
                  {students.filter(s => s.isSubmitted).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Pending Verification</span>
                <span className="font-bold text-yellow-600">
                  {students.filter(s => s.verificationStatus === 'Pending').length}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSubmitAllOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmitAllToEAES}
              disabled={!canSubmitToEAES}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit All Verified Students
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit School Profile</DialogTitle>
            <DialogDescription>
              Update your school information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="principalName">Principal Name</Label>
                <Input
                  id="principalName"
                  value={editedProfile.principalName}
                  onChange={(e) => handleProfileChange('principalName', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={editedProfile.region}
                  onChange={(e) => handleProfileChange('region', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editedProfile.city}
                  onChange={(e) => handleProfileChange('city', e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}