"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  GraduationCap,
  Bell,
  LogOut,
  Eye,
  Plus,
  Edit,
  FileText,
  BarChart3,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  User,
  School as SchoolIcon,
  MapPin,
  Award,
  TrendingUp
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function StudentDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState({
    id: "stu_001",
    fullname: "John Doe",
    email: "john@example.com",
    nationalId: "ET-123456789",
    birthDate: "2005-05-15",
    academicYear: "2024",
    gpa: 3.8,
    school: "Addis Ababa High School",
    schoolId: "sch_001",
    city: "Addis Ababa",
    region: "Addis Ababa",
    status: "active",
    placementStatus: "pending"
  })

  const [submissions, setSubmissions] = useState([])
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // Mock API calls
      setTimeout(() => {
        setSubmissions([
          {
            id: "sub_001",
            studentId: "stu_001",
            academicYear: "2024",
            status: "submitted",
            universityChoices: [
              { universityId: "uni_001", rank: 1, name: "Addis Ababa University", abbreviation: "AAU" },
              { universityId: "uni_002", rank: 2, name: "Hawassa University", abbreviation: "HU" },
              { universityId: "uni_003", rank: 3, name: "Bahir Dar University", abbreviation: "BDU" }
            ],
            naturalScienceRank: 1500,
            socialScienceRank: 1200,
            teacherInNaturalScienceRank: 800,
            teacherInSocialScienceRank: 600,
            submittedAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T10:30:00Z"
          }
        ])

        setPlacements([
          {
            id: "place_001",
            studentId: "stu_001",
            unniversityId: "uni_001",
            universityName: "Addis Ababa University",
            status: "under_review",
            submittedAt: "2024-01-20T09:15:00Z",
            createdAt: "2024-01-20T09:15:00Z"
          }
        ])

        setLoading(false)
      }, 1000)
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    // Clear session and redirect
    router.push("/login")
  }

  const stats = [
    { label: "GPA", value: student.gpa, icon: Award, color: "text-green-500" },
    { label: "National Rank", value: "#1,500", icon: TrendingUp, color: "text-blue-500" },
    { label: "Applications", value: submissions.length, icon: FileText, color: "text-purple-500" },
    { label: "Placement Status", value: "Pending", icon: Clock, color: "text-amber-500" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Student Portal</span>
              <Badge variant="outline">Student</Badge>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.fullname}`} />
                  <AvatarFallback>{student.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{student.fullname}</p>
                  <p className="text-xs text-muted-foreground">{student.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {student.fullname}!</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>National ID: {student.nationalId}</span>
            </div>
            <div className="flex items-center gap-1">
              <SchoolIcon className="w-4 h-4" />
              <span>{student.school}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{student.city}, {student.region}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color || "text-foreground"}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color.replace("text-", "bg-")}/10`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="placements">Placements</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Application Status</CardTitle>
                <CardDescription>Track your university application progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Submission Progress</span>
                      <span className="text-sm font-bold">60% Complete</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Natural Science</p>
                      <p className="text-xl font-bold mt-2">Rank #{student.naturalScienceRank || 1500}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Social Science</p>
                      <p className="text-xl font-bold mt-2">Rank #{student.socialScienceRank || 1200}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Teacher (Natural)</p>
                      <p className="text-xl font-bold mt-2">Rank #{student.teacherInNaturalScienceRank || 800}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Teacher (Social)</p>
                      <p className="text-xl font-bold mt-2">Rank #{student.teacherInSocialScienceRank || 600}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                    <Plus className="w-6 h-6" />
                    <span>New Application</span>
                  </Button>
                  <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                    <Edit className="w-6 h-6" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                    <Download className="w-6 h-6" />
                    <span>Documents</span>
                  </Button>
                  <Button className="h-auto py-6 flex flex-col gap-2" variant="outline">
                    <BarChart3 className="w-6 h-6" />
                    <span>Statistics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Applications</CardTitle>
                    <CardDescription>Manage and track your university applications</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Application
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                    <p className="text-muted-foreground mb-6">Start your first university application</p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Application
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <Card key={submission.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge>{submission.status.toUpperCase()}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="font-bold text-lg">Academic Year {submission.academicYear}</h3>
                              <p className="text-muted-foreground mt-1">
                                {submission.universityChoices.length} university choices
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div>
                            <h4 className="font-medium mb-2">University Choices:</h4>
                            <div className="space-y-2">
                              {submission.universityChoices.map((choice, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border rounded">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <span className="font-bold">{choice.rank}</span>
                                    </div>
                                    <div>
                                      <p className="font-medium">{choice.name}</p>
                                      <p className="text-sm text-muted-foreground">{choice.abbreviation}</p>
                                    </div>
                                  </div>
                                  <Badge variant="outline">Choice {choice.rank}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="placements">
            <Card>
              <CardHeader>
                <CardTitle>Placement Results</CardTitle>
                <CardDescription>View your university placement status</CardDescription>
              </CardHeader>
              <CardContent>
                {placements.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No placements yet</h3>
                    <p className="text-muted-foreground">Your placement results will appear here once available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {placements.map((placement) => (
                      <Card key={placement.id} className={placement.status === "approved" ? "border-green-200 bg-green-50" : ""}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                {placement.status === "approved" ? (
                                  <Badge className="bg-green-500">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approved
                                  </Badge>
                                ) : placement.status === "rejected" ? (
                                  <Badge variant="destructive">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Rejected
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Under Review
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-bold text-xl mb-2">{placement.universityName}</h3>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>Submitted: {new Date(placement.submittedAt).toLocaleDateString()}</p>
                                <p>Created: {new Date(placement.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Button variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>Your personal information and academic details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input value={student.fullname} readOnly />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={student.email} readOnly />
                    </div>
                    <div>
                      <Label>National ID</Label>
                      <Input value={student.nationalId} readOnly />
                    </div>
                    <div>
                      <Label>Birth Date</Label>
                      <Input value={new Date(student.birthDate).toLocaleDateString()} readOnly />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Academic Year</Label>
                      <Input value={student.academicYear} readOnly />
                    </div>
                    <div>
                      <Label>GPA</Label>
                      <Input value={student.gpa} readOnly />
                    </div>
                    <div>
                      <Label>School</Label>
                      <Input value={student.school} readOnly />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="flex items-center gap-2">
                        <Input value={student.status} readOnly />
                        <Badge variant={student.status === "active" ? "default" : "outline"}>
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline">Edit Profile</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}