"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    School,
    Users,
    Building,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    Download,
    BarChart3,
    Home,
    Target,
    PieChart,
    User,
    Mail,
    Phone,
    MapPin,
    BookOpen,
    GraduationCap
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function CityDashboard() {
    const router = useRouter()

    // City data
    const [city, setCity] = useState({
        id: "city_001",
        name: "Addis Ababa",
        region: "Addis Ababa",
        totalSchools: 245,
        totalStudents: 45200,
        placementRate: "94%",
        mayor: "Adanech Abiebie"
    })

    // Schools data
    const [schools, setSchools] = useState([])

    // School Admins data
    const [schoolAdmins, setSchoolAdmins] = useState([])

    // Form states
    const [newSchool, setNewSchool] = useState({
        name: "",
        code: "",
        type: "",
        address: ""
    })

    const [newSchoolAdmin, setNewSchoolAdmin] = useState({
        schoolId: "",
        name: "",
        email: "",
        phone: ""
    })

    const [loading, setLoading] = useState(true)
    const [selectedSchoolId, setSelectedSchoolId] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            // Mock schools data
            const mockSchools = [
                {
                    id: "sch_001",
                    name: "Addis Ababa High School",
                    code: "AAHS001",
                    type: "public",
                    address: "Bole, Addis Ababa",
                    totalStudents: 2500,
                    totalTeachers: 120,
                    createdAt: "2024-01-15"
                },
                {
                    id: "sch_002",
                    name: "Ethio-Japan Secondary School",
                    code: "EJSS002",
                    type: "public",
                    address: "Kazanches, Addis Ababa",
                    totalStudents: 1800,
                    totalTeachers: 85,
                    createdAt: "2024-01-14"
                },
                {
                    id: "sch_003",
                    name: "International Community School",
                    code: "ICS003",
                    type: "international",
                    address: "Old Airport, Addis Ababa",
                    totalStudents: 1200,
                    totalTeachers: 65,
                    createdAt: "2024-01-13"
                },
                {
                    id: "sch_004",
                    name: "Nazareth School",
                    code: "NS004",
                    type: "private",
                    address: "Megenagna, Addis Ababa",
                    totalStudents: 1500,
                    totalTeachers: 70,
                    createdAt: "2024-01-12"
                }
            ]

            // Mock school admins data
            const mockSchoolAdmins = [
                {
                    id: "sadm_001",
                    schoolId: "sch_001",
                    schoolName: "Addis Ababa High School",
                    name: "Dr. Samuel Getachew",
                    email: "principal@aahs.edu.et",
                    phone: "+251 11 111 1111",
                    role: "Principal"
                },
                {
                    id: "sadm_002",
                    schoolId: "sch_002",
                    schoolName: "Ethio-Japan Secondary School",
                    name: "Mrs. Martha Alemu",
                    email: "admin@ejss.edu.et",
                    phone: "+251 11 222 2222",
                    role: "Admin Officer"
                },
                {
                    id: "sadm_003",
                    schoolId: "sch_003",
                    schoolName: "International Community School",
                    name: "Mr. David Johnson",
                    email: "director@ics.edu.et",
                    phone: "+251 11 333 3333",
                    role: "School Director"
                }
            ]

            setSchools(mockSchools)
            setSchoolAdmins(mockSchoolAdmins)
            setLoading(false)
        }, 500)
    }, [])

    const handleAddSchool = () => {
        if (!newSchool.name || !newSchool.code || !newSchool.type) {
            alert("Please fill all required fields")
            return
        }

        const newSchoolObj = {
            id: `sch_${String(schools.length + 1).padStart(3, '0')}`,
            name: newSchool.name,
            code: newSchool.code,
            type: newSchool.type,
            address: newSchool.address || "Not specified",
            totalStudents: 0,
            totalTeachers: 0,
            createdAt: new Date().toISOString().split('T')[0]
        }

        setSchools([...schools, newSchoolObj])
        setCity(prev => ({
            ...prev,
            totalSchools: prev.totalSchools + 1
        }))
        setNewSchool({ name: "", code: "", type: "", address: "" })
    }

    const handleAddSchoolAdmin = () => {
        if (!newSchoolAdmin.schoolId || !newSchoolAdmin.name || !newSchoolAdmin.email) {
            alert("Please fill all required fields")
            return
        }

        const school = schools.find(s => s.id === newSchoolAdmin.schoolId)
        const newAdminObj = {
            id: `sadm_${String(schoolAdmins.length + 1).padStart(3, '0')}`,
            schoolId: newSchoolAdmin.schoolId,
            schoolName: school?.name || "Unknown School",
            name: newSchoolAdmin.name,
            email: newSchoolAdmin.email,
            phone: newSchoolAdmin.phone || "Not provided",
            role: "School Admin"
        }

        setSchoolAdmins([...schoolAdmins, newAdminObj])
        setNewSchoolAdmin({ schoolId: "", name: "", email: "", phone: "" })
    }

    const handleDeleteSchool = (id) => {
        setSchools(schools.filter(school => school.id !== id))
        // Also remove school admins for this school
        setSchoolAdmins(schoolAdmins.filter(admin => admin.schoolId !== id))
        setCity(prev => ({
            ...prev,
            totalSchools: Math.max(0, prev.totalSchools - 1)
        }))
    }

    const handleDeleteSchoolAdmin = (id) => {
        setSchoolAdmins(schoolAdmins.filter(admin => admin.id !== id))
    }

    const navigateToSchoolAdmins = (schoolId) => {
        setSelectedSchoolId(schoolId)
        const tabs = document.querySelector('[data-state="active"]')
        if (tabs) {
            const schoolAdminsTab = document.querySelector('[value="school-admins"]')
            if (schoolAdminsTab) {
                schoolAdminsTab.click()
            }
        }
    }

    const handleLogout = () => {
        router.push("/login")
    }

    const getSchoolTypeBadge = (type) => {
        switch (type) {
            case "public":
                return <Badge className="bg-blue-500">Public</Badge>
            case "private":
                return <Badge className="bg-green-500">Private</Badge>
            case "international":
                return <Badge className="bg-purple-500">International</Badge>
            default:
                return <Badge variant="outline">{type}</Badge>
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading City Dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Building className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{city.name} City Dashboard</h1>
                                <p className="text-sm text-gray-500">City Administration</p>
                            </div>
                            <Badge variant="outline" className="ml-2">City Admin</Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6">
                <Tabs defaultValue="schools" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="schools">Schools</TabsTrigger>
                        <TabsTrigger value="school-admins">School Admins</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab - Optional */}
                    <TabsContent value="overview">
                        <div className="grid md:grid-cols-4 gap-6 mb-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <School className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{city.totalSchools}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total Schools</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-6 h-6 text-green-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{city.totalStudents.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total Students</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <GraduationCap className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{city.placementRate}</p>
                                        <p className="text-sm text-gray-500 mt-2">Placement Rate</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BookOpen className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <p className="text-3xl font-bold">85%</p>
                                        <p className="text-sm text-gray-500 mt-2">Completion Rate</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>City Information</CardTitle>
                                <CardDescription>{city.name} City Details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <Building className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">City Name</p>
                                                <p className="font-medium">{city.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <MapPin className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Region</p>
                                                <p className="font-medium">{city.region}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-purple-50 rounded-lg">
                                                <User className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">City Mayor</p>
                                                <p className="font-medium">{city.mayor}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-amber-50 rounded-lg">
                                                <Home className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Largest School</p>
                                                <p className="font-medium">Addis Ababa High School</p>
                                                <p className="text-xs text-gray-500">2,500 students</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* School Type Distribution */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>School Types in {city.name}</CardTitle>
                                <CardDescription>Distribution of schools by type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {schools.filter(s => s.type === "public").length}
                                        </div>
                                        <div className="text-sm text-gray-500">Public Schools</div>
                                        <Badge className="mt-2 bg-blue-500">Public</Badge>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {schools.filter(s => s.type === "private").length}
                                        </div>
                                        <div className="text-sm text-gray-500">Private Schools</div>
                                        <Badge className="mt-2 bg-green-500">Private</Badge>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {schools.filter(s => s.type === "international").length}
                                        </div>
                                        <div className="text-sm text-gray-500">International</div>
                                        <Badge className="mt-2 bg-purple-500">International</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Schools Tab - Main Feature */}
                    <TabsContent value="schools">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Schools Management</CardTitle>
                                        <CardDescription>Register and manage schools in {city.name}</CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add School
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Register New School</DialogTitle>
                                                <DialogDescription>Add a new school in {city.name} city</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="school-name">School Name *</Label>
                                                    <Input
                                                        id="school-name"
                                                        value={newSchool.name}
                                                        onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                                                        placeholder="e.g., St. Mary School"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="school-code">School Code *</Label>
                                                    <Input
                                                        id="school-code"
                                                        value={newSchool.code}
                                                        onChange={(e) => setNewSchool({ ...newSchool, code: e.target.value })}
                                                        placeholder="e.g., SMS001"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="school-type">School Type *</Label>
                                                    <Select
                                                        value={newSchool.type}
                                                        onValueChange={(value) => setNewSchool({ ...newSchool, type: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select school type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="public">Public School</SelectItem>
                                                            <SelectItem value="private">Private School</SelectItem>
                                                            <SelectItem value="international">International School</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="school-address">Address</Label>
                                                    <Textarea
                                                        id="school-address"
                                                        value={newSchool.address}
                                                        onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                                                        placeholder="Enter school address..."
                                                        rows={2}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddSchool}>Register School</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>School Name</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Address</TableHead>
                                                <TableHead>Students</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {schools.map(school => (
                                                <TableRow key={school.id}>
                                                    <TableCell className="font-mono text-sm">{school.id}</TableCell>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <School className="w-4 h-4 text-blue-500" />
                                                            {school.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{school.code}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getSchoolTypeBadge(school.type)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm max-w-[200px] truncate">
                                                            {school.address}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{school.totalStudents.toLocaleString()}</div>
                                                        <div className="text-xs text-gray-500">{school.totalTeachers} teachers</div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => navigateToSchoolAdmins(school.id)}
                                                                title="Manage School Admins"
                                                            >
                                                                <Users className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDeleteSchool(school.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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

                        {/* School Statistics */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>School Statistics</CardTitle>
                                <CardDescription>Overview of schools in {city.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {Math.max(...schools.map(s => s.totalStudents))?.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-500">Largest School</div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {schools.find(s => s.totalStudents === Math.max(...schools.map(s => s.totalStudents)))?.name}
                                        </div>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {schools.reduce((sum, school) => sum + school.totalTeachers, 0)}
                                        </div>
                                        <div className="text-sm text-gray-500">Total Teachers</div>
                                        <div className="text-xs text-gray-400 mt-1">Across all schools</div>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {schools.length}
                                        </div>
                                        <div className="text-sm text-gray-500">Total Schools</div>
                                        <div className="text-xs text-gray-400 mt-1">In {city.name}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* School Admins Tab */}
                    <TabsContent value="school-admins">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>School Admins Management</CardTitle>
                                        <CardDescription>
                                            {selectedSchoolId ?
                                                `Admins for selected school` :
                                                "Manage school administrators in " + city.name
                                            }
                                        </CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add School Admin
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add School Admin</DialogTitle>
                                                <DialogDescription>Assign an admin to a school</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-school">School *</Label>
                                                    <Select
                                                        value={newSchoolAdmin.schoolId}
                                                        onValueChange={(value) => setNewSchoolAdmin({ ...newSchoolAdmin, schoolId: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select school" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {schools.map(school => (
                                                                <SelectItem key={school.id} value={school.id}>
                                                                    {school.name} ({school.code})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-name">Admin Name *</Label>
                                                    <Input
                                                        id="admin-name"
                                                        value={newSchoolAdmin.name}
                                                        onChange={(e) => setNewSchoolAdmin({ ...newSchoolAdmin, name: e.target.value })}
                                                        placeholder="e.g., John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-email">Admin Email *</Label>
                                                    <Input
                                                        id="admin-email"
                                                        type="email"
                                                        value={newSchoolAdmin.email}
                                                        onChange={(e) => setNewSchoolAdmin({ ...newSchoolAdmin, email: e.target.value })}
                                                        placeholder="e.g., admin@school.edu.et"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-phone">Admin Phone</Label>
                                                    <Input
                                                        id="admin-phone"
                                                        value={newSchoolAdmin.phone}
                                                        onChange={(e) => setNewSchoolAdmin({ ...newSchoolAdmin, phone: e.target.value })}
                                                        placeholder="e.g., +251 11 123 4567"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddSchoolAdmin}>Add Admin</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>School</TableHead>
                                                <TableHead>Admin Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {schoolAdmins
                                                .filter(admin => !selectedSchoolId || admin.schoolId === selectedSchoolId)
                                                .map(admin => (
                                                    <TableRow key={admin.id}>
                                                        <TableCell className="font-mono text-sm">{admin.id}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <School className="w-4 h-4 text-blue-500" />
                                                                <span>{admin.schoolName}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm">{admin.email}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm">{admin.phone || "Not provided"}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{admin.role}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button size="sm" variant="outline">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleDeleteSchoolAdmin(admin.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
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

                        {/* Admin Coverage */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Admin Coverage</CardTitle>
                                <CardDescription>Schools with and without administrators</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {schoolAdmins.length}
                                        </div>
                                        <div className="text-sm text-gray-500">Total School Admins</div>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {new Set(schoolAdmins.map(a => a.schoolId)).size}
                                        </div>
                                        <div className="text-sm text-gray-500">Schools with Admins</div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            out of {schools.length} total schools
                                        </div>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-amber-600">
                                            {schools.length - new Set(schoolAdmins.map(a => a.schoolId)).size}
                                        </div>
                                        <div className="text-sm text-gray-500">Schools without Admins</div>
                                        <div className="text-xs text-gray-400 mt-1">Need assignment</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab - Optional */}
                    <TabsContent value="analytics">
                        <Card>
                            <CardHeader>
                                <CardTitle>City Education Analytics</CardTitle>
                                <CardDescription>Comprehensive analytics for {city.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* School Size Distribution */}
                                    <div>
                                        <h3 className="font-bold mb-4">School Size Distribution</h3>
                                        <div className="space-y-3">
                                            {schools.map(school => {
                                                const percentage = (school.totalStudents / city.totalStudents) * 100
                                                return (
                                                    <div key={school.id} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>{school.name}</span>
                                                            <span>{school.totalStudents.toLocaleString()} students ({percentage.toFixed(1)}%)</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-600 h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* School Type Analysis */}
                                    <div>
                                        <h3 className="font-bold mb-4">School Type Analysis</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center p-4 border rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {schools.filter(s => s.type === "public").length}
                                                </div>
                                                <div className="text-sm text-gray-500">Public Schools</div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {((schools.filter(s => s.type === "public").length / schools.length) * 100).toFixed(1)}%
                                                </div>
                                            </div>

                                            <div className="text-center p-4 border rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {schools.filter(s => s.type === "private").length}
                                                </div>
                                                <div className="text-sm text-gray-500">Private Schools</div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {((schools.filter(s => s.type === "private").length / schools.length) * 100).toFixed(1)}%
                                                </div>
                                            </div>

                                            <div className="text-center p-4 border rounded-lg">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {schools.filter(s => s.type === "international").length}
                                                </div>
                                                <div className="text-sm text-gray-500">International</div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {((schools.filter(s => s.type === "international").length / schools.length) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Statistics */}
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <p className="text-sm text-gray-500">Average Students per School</p>
                                            <p className="text-xl font-bold mt-1">
                                                {(city.totalStudents / city.totalSchools).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Target className="w-5 h-5 text-green-600" />
                                            </div>
                                            <p className="text-sm text-gray-500">Admin Coverage Rate</p>
                                            <p className="text-xl font-bold mt-1">
                                                {((new Set(schoolAdmins.map(a => a.schoolId)).size / schools.length) * 100).toFixed(0)}%
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">Schools with admins</p>
                                        </div>

                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <PieChart className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <p className="text-sm text-gray-500">Teacher-Student Ratio</p>
                                            <p className="text-xl font-bold mt-1">1:38</p>
                                            <p className="text-xs text-gray-500 mt-1">Average ratio</p>
                                        </div>
                                    </div>

                                    {/* Export Options */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="font-bold">Export City Data</h3>
                                                    <p className="text-sm text-gray-500">Download comprehensive city reports</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Schools List
                                                    </Button>
                                                    <Button variant="outline">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Admins List
                                                    </Button>
                                                    <Button variant="outline">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Analytics Report
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}