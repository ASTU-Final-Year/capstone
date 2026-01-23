"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Building,
    Users,
    BarChart3,
    Bell,
    LogOut,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Settings,
    MapPin,
    Mail,
    Phone,
    Globe,
    Calendar,
    BookOpen,
    Target,
    Percent
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function UniversityDashboard() {
    const router = useRouter()
    const [university, setUniversity] = useState({
        id: "uni_001",
        name: "Addis Ababa University",
        abbreviation: "AAU",
        regionId: "region_001",
        region: "Addis Ababa",
        longitude: 38.7636,
        latitude: 9.0054,
        capacity: 5000,
        enrolled: 4250,
        website: "www.aau.edu.et",
        contactEmail: "admissions@aau.edu.et",
        contactPhone: "+251 11 123 4567",
        isActive: true
    })

    const [applications, setApplications] = useState([])
    const [placements, setPlacements] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalApplications: 2450,
        pendingReview: 325,
        accepted: 1850,
        rejected: 275,
        utilizationRate: 85
    })

    useEffect(() => {
        const fetchData = async () => {
            setTimeout(() => {
                // Mock applications data
                const mockApplications = Array.from({ length: 12 }).map((_, idx) => ({
                    id: `app_${String(idx + 1).padStart(3, '0')}`,
                    studentId: `stu_${String(idx + 1).padStart(3, '0')}`,
                    studentName: `Student ${idx + 1}`,
                    nationalId: `ET-00${idx + 1}456789`,
                    gpa: (3.2 + (idx * 0.1)).toFixed(2),
                    rank: idx + 1,
                    status: idx % 4 === 0 ? "pending" : idx % 4 === 1 ? "under_review" : idx % 4 === 2 ? "accepted" : "rejected",
                    submittedAt: `2024-01-${String(10 + idx).padStart(2, '0')}T09:00:00Z`,
                    choiceRank: (idx % 5) + 1
                }))

                // Mock placements data
                const mockPlacements = Array.from({ length: 8 }).map((_, idx) => ({
                    id: `place_${String(idx + 1).padStart(3, '0')}`,
                    studentId: `stu_${String(idx + 1).padStart(3, '0')}`,
                    studentName: `Student ${idx + 1}`,
                    status: idx % 3 === 0 ? "under_review" : idx % 3 === 1 ? "approved" : "rejected",
                    submittedAt: `2024-01-${String(15 + idx).padStart(2, '0')}T14:30:00Z`,
                    approvedAt: idx % 3 === 1 ? `2024-01-${String(20 + idx).padStart(2, '0')}T10:00:00Z` : null
                }))

                setApplications(mockApplications)
                setPlacements(mockPlacements)
                setLoading(false)
            }, 1000)
        }
        fetchData()
    }, [])

    const handleLogout = () => {
        router.push("/login")
    }

    const dashboardStats = [
        {
            label: "Capacity Utilization",
            value: `${((university.enrolled / university.capacity) * 100).toFixed(1)}%`,
            description: `${university.enrolled.toLocaleString()} / ${university.capacity.toLocaleString()} seats`,
            icon: Target,
            color: "text-blue-500"
        },
        {
            label: "Total Applications",
            value: stats.totalApplications.toLocaleString(),
            description: "For current academic year",
            icon: Users,
            color: "text-purple-500"
        },
        {
            label: "Acceptance Rate",
            value: `${((stats.accepted / stats.totalApplications) * 100).toFixed(1)}%`,
            description: `${stats.accepted.toLocaleString()} accepted`,
            icon: Percent,
            color: "text-green-500"
        },
        {
            label: "Pending Review",
            value: stats.pendingReview.toLocaleString(),
            description: "Awaiting decision",
            icon: Clock,
            color: "text-amber-500"
        }
    ]

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading university dashboard...</p>
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
                                <Building className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-foreground">{university.name} ({university.abbreviation})</span>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span>{university.region}</span>
                                    <span>•</span>
                                    <span>Capacity: {university.capacity.toLocaleString()}</span>
                                    <span>•</span>
                                    <Badge variant={university.isActive ? "default" : "secondary"} className="h-5">
                                        {university.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                            <Badge variant="outline">University Admin</Badge>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="w-4 h-4" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </Button>
                            <Avatar>
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${university.abbreviation}`} />
                                <AvatarFallback>{university.abbreviation}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {dashboardStats.map((stat, idx) => (
                        <Card key={idx}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.color.replace("text-", "bg-")}/10`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="applications" className="space-y-8">
                    <TabsList className="grid grid-cols-5 w-full">
                        <TabsTrigger value="applications">Applications</TabsTrigger>
                        <TabsTrigger value="placements">Placements</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="capacity">Capacity</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="applications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Student Applications</CardTitle>
                                        <CardDescription>Review and manage student applications for {university.academicYear || "2024"}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Search applications..." className="pl-9 w-64" />
                                        </div>
                                        <Select defaultValue="all">
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filter by status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="under_review">Under Review</SelectItem>
                                                <SelectItem value="accepted">Accepted</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline">
                                            <Download className="w-4 h-4 mr-2" />
                                            Export
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Rank</TableHead>
                                                <TableHead>Student</TableHead>
                                                <TableHead>National ID</TableHead>
                                                <TableHead>GPA</TableHead>
                                                <TableHead>Choice Rank</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {applications.slice(0, 10).map((app) => (
                                                <TableRow key={app.id}>
                                                    <TableCell className="font-bold">#{app.rank}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.studentName}`} />
                                                                <AvatarFallback>{app.studentName.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium">{app.studentName}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Applied: {new Date(app.submittedAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{app.nationalId}</TableCell>
                                                    <TableCell>
                                                        <div className="font-bold">{app.gpa}</div>
                                                        <div className="w-20">
                                                            <Progress value={(parseFloat(app.gpa) / 4.0) * 100} className="h-1" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                                                            <span className="font-bold">{app.choiceRank}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={
                                                            app.status === "accepted" ? "default" :
                                                                app.status === "rejected" ? "destructive" :
                                                                    app.status === "under_review" ? "secondary" : "outline"
                                                        }>
                                                            {app.status === "under_review" ? "Under Review" : app.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="outline">
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View
                                                            </Button>
                                                            <Button size="sm" variant={
                                                                app.status === "accepted" ? "outline" :
                                                                    app.status === "rejected" ? "outline" : "default"
                                                            }>
                                                                {app.status === "pending" ? "Review" :
                                                                    app.status === "under_review" ? "Decide" : "Update"}
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
                    </TabsContent>

                    <TabsContent value="placements">
                        <Card>
                            <CardHeader>
                                <CardTitle>Placement Management</CardTitle>
                                <CardDescription>Review and approve student placements</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            {
                                                title: "Placement Requests",
                                                count: placements.length,
                                                icon: BookOpen,
                                                description: "Total placement requests"
                                            },
                                            {
                                                title: "Approval Rate",
                                                count: `${((placements.filter(p => p.status === "approved").length / placements.length) * 100).toFixed(1)}%`,
                                                icon: TrendingUp,
                                                description: "Of total placements"
                                            },
                                            {
                                                title: "Average Processing",
                                                count: "2.3 days",
                                                icon: Calendar,
                                                description: "Time to decision"
                                            }
                                        ].map((stat, idx) => (
                                            <Card key={idx}>
                                                <CardContent className="pt-6">
                                                    <div className="text-center">
                                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <stat.icon className="w-6 h-6 text-primary" />
                                                        </div>
                                                        <p className="text-2xl font-bold">{stat.count}</p>
                                                        <p className="text-sm font-medium mt-2">{stat.title}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg">Recent Placement Decisions</h3>
                                        {placements.slice(0, 5).map((placement) => (
                                            <div key={placement.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarFallback>{placement.studentName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{placement.studentName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Submitted: {new Date(placement.submittedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant={
                                                        placement.status === "approved" ? "default" :
                                                            placement.status === "rejected" ? "destructive" : "outline"
                                                    }>
                                                        {placement.status === "under_review" ? "Under Review" : placement.status}
                                                    </Badge>
                                                    {placement.approvedAt && (
                                                        <span className="text-sm text-muted-foreground">
                                                            Approved: {new Date(placement.approvedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    <Button size="sm" variant="outline">
                                                        Review
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="capacity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Capacity Management</CardTitle>
                                <CardDescription>Monitor and manage university capacity</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">Overall Capacity Utilization</span>
                                            <span className="font-bold">{((university.enrolled / university.capacity) * 100).toFixed(1)}%</span>
                                        </div>
                                        <Progress value={(university.enrolled / university.capacity) * 100} className="h-3" />
                                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                            <span>0%</span>
                                            <span>{university.enrolled.toLocaleString()} enrolled</span>
                                            <span>{university.capacity.toLocaleString()} capacity</span>
                                            <span>100%</span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-bold">Available Seats by Program</h3>
                                            {[
                                                { program: "Engineering", total: 1000, enrolled: 850, color: "bg-blue-500" },
                                                { program: "Medicine", total: 800, enrolled: 750, color: "bg-green-500" },
                                                { program: "Business", total: 1200, enrolled: 1000, color: "bg-purple-500" },
                                                { program: "Arts & Sciences", total: 2000, enrolled: 1650, color: "bg-orange-500" }
                                            ].map((program, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">{program.program}</span>
                                                        <span className="text-sm">{program.enrolled}/{program.total}</span>
                                                    </div>
                                                    <Progress
                                                        value={(program.enrolled / program.total) * 100}
                                                        className="h-2"
                                                        indicatorClassName={program.color}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <Card>
                                            <CardContent className="pt-6">
                                                <h3 className="font-bold mb-4">Quick Actions</h3>
                                                <div className="space-y-3">
                                                    <Button className="w-full justify-start" variant="outline">
                                                        <TrendingUp className="w-4 h-4 mr-2" />
                                                        Update Capacity
                                                    </Button>
                                                    <Button className="w-full justify-start" variant="outline">
                                                        <BarChart3 className="w-4 h-4 mr-2" />
                                                        View Reports
                                                    </Button>
                                                    <Button className="w-full justify-start" variant="outline">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Export Data
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>University Settings</CardTitle>
                                <CardDescription>Manage university information and preferences</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">University Name</label>
                                                <Input value={university.name} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Abbreviation</label>
                                                <Input value={university.abbreviation} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Region</label>
                                                <Input value={university.region} />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Contact Email</label>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    <Input value={university.contactEmail} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Contact Phone</label>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    <Input value={university.contactPhone} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Website</label>
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                                    <Input value={university.website} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Total Capacity</label>
                                                <Input
                                                    type="number"
                                                    value={university.capacity}
                                                    onChange={(e) => setUniversity(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Current Enrollment</label>
                                                <Input
                                                    type="number"
                                                    value={university.enrolled}
                                                    onChange={(e) => setUniversity(prev => ({ ...prev, enrolled: parseInt(e.target.value) }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={university.isActive}
                                            onChange={(e) => setUniversity(prev => ({ ...prev, isActive: e.target.checked }))}
                                            className="rounded border-gray-300"
                                        />
                                        <label htmlFor="isActive" className="text-sm font-medium">
                                            University is active and accepting applications
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline">Cancel</Button>
                                        <Button>Save Changes</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}