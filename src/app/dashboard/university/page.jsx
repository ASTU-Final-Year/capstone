"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Building,
    Users,
    BarChart3,
    Bell,
    LogOut,
    Download,
    Edit,
    Mail,
    Phone,
    Globe,
    MapPin,
    Percent,
    Calendar,
    BookOpen,
    Settings,
    CheckCircle,
    TrendingUp
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function UniversityDashboard() {
    const router = useRouter()

    const [university, setUniversity] = useState({
        id: "uni_001",
        name: "Addis Ababa University",
        abbreviation: "AAU",
        region: "Addis Ababa",
        capacity: 5000,
        currentEnrollment: 4250,
        website: "www.aau.edu.et",
        contactEmail: "admissions@aau.edu.et",
        contactPhone: "+251 11 123 4567",
        isActive: true
    })

    const [placements, setPlacements] = useState([
        { id: 1, studentName: "John Doe", program: "Computer Science", placementDate: "2024-06-15", status: "Confirmed" },
        { id: 2, studentName: "Jane Smith", program: "Medicine", placementDate: "2024-06-15", status: "Confirmed" },
        { id: 3, studentName: "Michael Johnson", program: "Engineering", placementDate: "2024-06-15", status: "Confirmed" },
        { id: 4, studentName: "Sarah Williams", program: "Business", placementDate: "2024-06-15", status: "Confirmed" },
        { id: 5, studentName: "David Brown", program: "Law", placementDate: "2024-06-15", status: "Confirmed" },
        { id: 6, studentName: "Emily Davis", program: "Medicine", placementDate: "2024-06-15", status: "Confirmed" },
    ])

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
    const [isEditCapacityOpen, setIsEditCapacityOpen] = useState(false)
    const [editedUniversity, setEditedUniversity] = useState({ ...university })
    const [newCapacity, setNewCapacity] = useState(university.capacity.toString())

    const stats = [
        {
            label: "Total Capacity",
            value: university.capacity.toLocaleString(),
            description: "Maximum student capacity",
            icon: Building,
            color: "text-blue-500"
        },
        {
            label: "Current Enrollment",
            value: university.currentEnrollment.toLocaleString(),
            description: "Students currently enrolled",
            icon: Users,
            color: "text-green-500"
        },
        {
            label: "Placement Utilization",
            value: `${((university.currentEnrollment / university.capacity) * 100).toFixed(1)}%`,
            description: "Capacity utilization rate",
            icon: Percent,
            color: "text-purple-500"
        },

    ]

    const handleUpdateProfile = (e) => {
        e.preventDefault()
        setUniversity(editedUniversity)
        setIsEditProfileOpen(false)
    }

    const handleUpdateCapacity = (e) => {
        e.preventDefault()
        const updatedUniversity = {
            ...university,
            capacity: parseInt(newCapacity)
        }
        setUniversity(updatedUniversity)
        setIsEditCapacityOpen(false)
    }

    const handleExportPlacements = () => {
        alert(`Exported ${placements.length} student placements to CSV`)
    }

    const handleLogout = () => {
        router.push("/login")
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
                                <span className="text-xl font-bold text-foreground">{university.name}</span>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span>{university.abbreviation} • {university.region}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
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
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, idx) => (
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

                {/* Main Content */}
                <Tabs defaultValue="placements" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="placements">
                            <Users className="mr-2 h-4 w-4" />
                            Student Placements
                        </TabsTrigger>
                        <TabsTrigger value="capacity">
                            <Building className="mr-2 h-4 w-4" />
                            Capacity
                        </TabsTrigger>
                        <TabsTrigger value="profile">
                            <Settings className="mr-2 h-4 w-4" />
                            Profile
                        </TabsTrigger>
                    </TabsList>

                    {/* Placements Tab */}
                    <TabsContent value="placements">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Student Placements</CardTitle>
                                        <CardDescription>
                                            View students placed at {university.name} through EAES
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" onClick={handleExportPlacements}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {placements.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Placements Yet</h3>
                                        <p className="text-gray-600">
                                            Student placements will appear here once EAES releases results
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Student Name</TableHead>
                                                    <TableHead>Program</TableHead>
                                                    <TableHead>Placement Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {placements.map((placement) => (
                                                    <TableRow key={placement.id}>
                                                        <TableCell className="font-medium">{placement.studentName}</TableCell>
                                                        <TableCell>{placement.program}</TableCell>
                                                        <TableCell>
                                                            {new Date(placement.placementDate).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="default">
                                                                {placement.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Capacity Tab */}
                    <TabsContent value="capacity">
                        <Card>
                            <CardHeader>
                                <CardTitle>University Capacity Management</CardTitle>
                                <CardDescription>
                                    Set and manage your university's student capacity
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="p-6 border rounded-lg bg-blue-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">Current Capacity Status</h3>
                                                <p className="text-sm text-gray-600">
                                                    Utilization: {((university.currentEnrollment / university.capacity) * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditCapacityOpen(true)}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Capacity
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Current Enrollment</span>
                                                <span className="font-bold">{university.currentEnrollment.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${(university.currentEnrollment / university.capacity) * 100}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Total Capacity</span>
                                                <span className="font-bold">{university.capacity.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-sm text-gray-600">
                                            <p>Available spots: {(university.capacity - university.currentEnrollment).toLocaleString()} students</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-yellow-800">Important Note</h4>
                                                <p className="text-yellow-700 text-sm mt-1">
                                                    Your university capacity determines how many students EAES can place at your institution.
                                                    Set this carefully as it affects national placement decisions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>University Profile</CardTitle>
                                        <CardDescription>
                                            Manage your university information
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
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">University Information</h3>
                                            <div className="mt-2 space-y-2">
                                                <p><span className="font-medium">Name:</span> {university.name}</p>
                                                <p><span className="font-medium">Abbreviation:</span> {university.abbreviation}</p>
                                                <p><span className="font-medium">Region:</span> {university.region}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                                            <div className="mt-2 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <span>{university.contactEmail}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span>{university.contactPhone}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    <span>{university.website}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                            <div className="mt-2 space-y-2">
                                                <p>
                                                    <span className="font-medium">Active:</span>{" "}
                                                    <Badge variant={university.isActive ? "default" : "secondary"}>
                                                        {university.isActive ? "Active" : "Inactive"}
                                                    </Badge>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit University Profile</DialogTitle>
                        <DialogDescription>
                            Update your university information
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">University Name</Label>
                                <Input
                                    id="name"
                                    value={editedUniversity.name}
                                    onChange={(e) => setEditedUniversity(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="abbreviation">Abbreviation</Label>
                                    <Input
                                        id="abbreviation"
                                        value={editedUniversity.abbreviation}
                                        onChange={(e) => setEditedUniversity(prev => ({ ...prev, abbreviation: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="region">Region</Label>
                                    <Input
                                        id="region"
                                        value={editedUniversity.region}
                                        onChange={(e) => setEditedUniversity(prev => ({ ...prev, region: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Contact Email</Label>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    value={editedUniversity.contactEmail}
                                    onChange={(e) => setEditedUniversity(prev => ({ ...prev, contactEmail: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone">Contact Phone</Label>
                                    <Input
                                        id="contactPhone"
                                        value={editedUniversity.contactPhone}
                                        onChange={(e) => setEditedUniversity(prev => ({ ...prev, contactPhone: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={editedUniversity.website}
                                        onChange={(e) => setEditedUniversity(prev => ({ ...prev, website: e.target.value }))}
                                    />
                                </div>
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

            {/* Edit Capacity Dialog */}
            <Dialog open={isEditCapacityOpen} onOpenChange={setIsEditCapacityOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Edit University Capacity</DialogTitle>
                        <DialogDescription>
                            Update your university's student capacity
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateCapacity}>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentEnrollment">Current Enrollment</Label>
                                <Input
                                    id="currentEnrollment"
                                    value={university.currentEnrollment}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newCapacity">New Total Capacity</Label>
                                <Input
                                    id="newCapacity"
                                    type="number"
                                    min={university.currentEnrollment}
                                    value={newCapacity}
                                    onChange={(e) => setNewCapacity(e.target.value)}
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    Must be at least current enrollment ({university.currentEnrollment.toLocaleString()})
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    <span className="font-semibold">Note:</span> Changing capacity affects EAES placement decisions for future batches.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditCapacityOpen(false)
                                    setNewCapacity(university.capacity.toString())
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={parseInt(newCapacity) < university.currentEnrollment}
                            >
                                Update Capacity
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}