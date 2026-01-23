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
    Shield,
    Building,
    MapPin,
    Users,
    Target,
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    TrendingUp,
    UserPlus,
    Download,
    BarChart3,
    ArrowRight,
    Link
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SuperAdminDashboard() {
    const router = useRouter()

    // States
    const [regions, setRegions] = useState([])
    const [universities, setUniversities] = useState([])
    const [regionalAdmins, setRegionalAdmins] = useState([])
    const [universityAdmins, setUniversityAdmins] = useState([])
    const [placements, setPlacements] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRegionId, setSelectedRegionId] = useState(null)
    const [selectedUniversityId, setSelectedUniversityId] = useState(null)

    // Form states
    const [newRegion, setNewRegion] = useState({
        name: "",
        code: ""
    })

    const [newUniversity, setNewUniversity] = useState({
        name: "",
        abbreviation: ""
    })

    const [newRegionalAdmin, setNewRegionalAdmin] = useState({
        regionId: "",
        name: "",
        email: "",
        phone: ""
    })

    const [newUniversityAdmin, setNewUniversityAdmin] = useState({
        universityId: "",
        name: "",
        email: "",
        phone: ""
    })

    const [newPlacement, setNewPlacement] = useState({
        name: "",
        academicYear: "2024"
    })

    // Initialize with sample data
    useEffect(() => {
        setTimeout(() => {
            setRegions([
                { id: "reg_001", name: "Addis Ababa", code: "AA", createdAt: "2024-01-15" },
                { id: "reg_002", name: "Oromia", code: "OR", createdAt: "2024-01-14" },
                { id: "reg_003", name: "Amhara", code: "AM", createdAt: "2024-01-13" },
                { id: "reg_004", name: "SNNPR", code: "SN", createdAt: "2024-01-12" },
                { id: "reg_005", name: "Tigray", code: "TG", createdAt: "2024-01-11" }
            ])

            setUniversities([
                { id: "uni_001", name: "Addis Ababa University", abbreviation: "AAU", status: "active" },
                { id: "uni_002", name: "Hawassa University", abbreviation: "HU", status: "active" },
                { id: "uni_003", name: "Bahir Dar University", abbreviation: "BDU", status: "active" },
                { id: "uni_004", name: "Jimma University", abbreviation: "JU", status: "active" },
                { id: "uni_005", name: "Mekelle University", abbreviation: "MU", status: "inactive" }
            ])

            setRegionalAdmins([
                { id: "radm_001", regionId: "reg_001", regionName: "Addis Ababa", name: "John Doe", email: "john@aa.gov.et", phone: "+251 11 123 4567" },
                { id: "radm_002", regionId: "reg_002", regionName: "Oromia", name: "Jane Smith", email: "jane@or.gov.et", phone: "+251 22 234 5678" },
                { id: "radm_003", regionId: "reg_003", regionName: "Amhara", name: "Mike Johnson", email: "mike@am.gov.et", phone: "+251 33 345 6789" }
            ])

            setUniversityAdmins([
                { id: "uadm_001", universityId: "uni_001", universityName: "Addis Ababa University", name: "Dr. Samuel", email: "admin@aau.edu.et", phone: "+251 11 111 1111" },
                { id: "uadm_002", universityId: "uni_002", universityName: "Hawassa University", name: "Dr. Martha", email: "admin@hu.edu.et", phone: "+251 22 222 2222" },
                { id: "uadm_003", universityId: "uni_003", universityName: "Bahir Dar University", name: "Dr. Alex", email: "admin@bdu.edu.et", phone: "+251 33 333 3333" }
            ])

            setPlacements([
                { id: "place_001", name: "2024 Placement", academicYear: "2024", status: "started", startedAt: "2024-01-15", completedAt: null },
                { id: "place_002", name: "2023 Placement", academicYear: "2023", status: "done", startedAt: "2023-01-10", completedAt: "2023-03-15" }
            ])

            setLoading(false)
        }, 500)
    }, [])

    const handleAddRegion = () => {
        if (!newRegion.name || !newRegion.code) {
            alert("Please fill all fields")
            return
        }

        const newRegionObj = {
            id: `reg_${String(regions.length + 1).padStart(3, '0')}`,
            name: newRegion.name,
            code: newRegion.code,
            createdAt: new Date().toISOString().split('T')[0]
        }

        setRegions([...regions, newRegionObj])
        setNewRegion({ name: "", code: "" })
    }

    const handleAddUniversity = () => {
        if (!newUniversity.name || !newUniversity.abbreviation) {
            alert("Please fill all fields")
            return
        }

        const newUniObj = {
            id: `uni_${String(universities.length + 1).padStart(3, '0')}`,
            name: newUniversity.name,
            abbreviation: newUniversity.abbreviation,
            status: "active"
        }

        setUniversities([...universities, newUniObj])
        setNewUniversity({ name: "", abbreviation: "" })
    }

    const handleAddRegionalAdmin = () => {
        if (!newRegionalAdmin.regionId || !newRegionalAdmin.name || !newRegionalAdmin.email) {
            alert("Please fill all required fields")
            return
        }

        const region = regions.find(r => r.id === newRegionalAdmin.regionId)
        const newAdminObj = {
            id: `radm_${String(regionalAdmins.length + 1).padStart(3, '0')}`,
            regionId: newRegionalAdmin.regionId,
            regionName: region?.name || "Unknown Region",
            name: newRegionalAdmin.name,
            email: newRegionalAdmin.email,
            phone: newRegionalAdmin.phone || "Not provided"
        }

        setRegionalAdmins([...regionalAdmins, newAdminObj])
        setNewRegionalAdmin({ regionId: "", name: "", email: "", phone: "" })
    }

    const handleAddUniversityAdmin = () => {
        if (!newUniversityAdmin.universityId || !newUniversityAdmin.name || !newUniversityAdmin.email) {
            alert("Please fill all required fields")
            return
        }

        const university = universities.find(u => u.id === newUniversityAdmin.universityId)
        const newAdminObj = {
            id: `uadm_${String(universityAdmins.length + 1).padStart(3, '0')}`,
            universityId: newUniversityAdmin.universityId,
            universityName: university?.name || "Unknown University",
            name: newUniversityAdmin.name,
            email: newUniversityAdmin.email,
            phone: newUniversityAdmin.phone || "Not provided"
        }

        setUniversityAdmins([...universityAdmins, newAdminObj])
        setNewUniversityAdmin({ universityId: "", name: "", email: "", phone: "" })
    }

    const handleDeleteRegion = (id) => {
        setRegions(regions.filter(region => region.id !== id))
        // Also remove any admins associated with this region
        setRegionalAdmins(regionalAdmins.filter(admin => admin.regionId !== id))
    }

    const handleDeleteUniversity = (id) => {
        setUniversities(universities.filter(uni => uni.id !== id))
        // Also remove any admins associated with this university
        setUniversityAdmins(universityAdmins.filter(admin => admin.universityId !== id))
    }

    const handleDeleteRegionalAdmin = (id) => {
        setRegionalAdmins(regionalAdmins.filter(admin => admin.id !== id))
    }

    const handleDeleteUniversityAdmin = (id) => {
        setUniversityAdmins(universityAdmins.filter(admin => admin.id !== id))
    }

    const handleInitiatePlacement = () => {
        if (!newPlacement.name) {
            alert("Please enter placement name")
            return
        }

        const newPlacementObj = {
            id: `place_${String(placements.length + 1).padStart(3, '0')}`,
            name: newPlacement.name,
            academicYear: newPlacement.academicYear,
            status: "not_started",
            startedAt: null,
            completedAt: null
        }

        setPlacements([...placements, newPlacementObj])
        setNewPlacement({ name: "", academicYear: "2024" })
    }

    const handleStartPlacement = (id) => {
        setPlacements(placements.map(placement =>
            placement.id === id
                ? { ...placement, status: "started", startedAt: new Date().toISOString().split('T')[0] }
                : placement
        ))
    }

    const handleCompletePlacement = (id) => {
        setPlacements(placements.map(placement =>
            placement.id === id
                ? { ...placement, status: "done", completedAt: new Date().toISOString().split('T')[0] }
                : placement
        ))
    }

    const navigateToRegionalAdmins = (regionId) => {
        setSelectedRegionId(regionId)
        const tabs = document.querySelector('[data-state="active"]')
        if (tabs) {
            const regionalAdminsTab = document.querySelector('[value="regional-admins"]')
            if (regionalAdminsTab) {
                regionalAdminsTab.click()
            }
        }
    }

    const navigateToUniversityAdmins = (universityId) => {
        setSelectedUniversityId(universityId)
        const tabs = document.querySelector('[data-state="active"]')
        if (tabs) {
            const universityAdminsTab = document.querySelector('[value="university-admins"]')
            if (universityAdminsTab) {
                universityAdminsTab.click()
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading Super Admin Dashboard...</p>
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
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">ChoiceX Super Admin</h1>
                                <p className="text-sm text-gray-500">System Administration</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="regions">Regions</TabsTrigger>
                        <TabsTrigger value="regional-admins">Regional Admins</TabsTrigger>
                        <TabsTrigger value="universities">Universities</TabsTrigger>
                        <TabsTrigger value="university-admins">University Admins</TabsTrigger>
                        <TabsTrigger value="placements">Placements</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <div className="grid md:grid-cols-4 gap-6 mb-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MapPin className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{regions.length}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total Regions</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Building className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{universities.length}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total Universities</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-6 h-6 text-green-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{regionalAdmins.length + universityAdmins.length}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total Admins</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Target className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{placements.length}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total Placements</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Regions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {regions.slice(0, 3).map(region => (
                                            <div key={region.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{region.name}</p>
                                                    <p className="text-sm text-gray-500">Code: {region.code}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => navigateToRegionalAdmins(region.id)}
                                                >
                                                    <Link className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Universities</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {universities.slice(0, 3).map(uni => (
                                            <div key={uni.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{uni.name}</p>
                                                    <p className="text-sm text-gray-500">{uni.abbreviation}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => navigateToUniversityAdmins(uni.id)}
                                                >
                                                    <Link className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Regions Tab */}
                    <TabsContent value="regions">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Regions Management</CardTitle>
                                        <CardDescription>Manage system regions</CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Region
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New Region</DialogTitle>
                                                <DialogDescription>Register a new region in the system</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="region-name">Region Name *</Label>
                                                    <Input
                                                        id="region-name"
                                                        value={newRegion.name}
                                                        onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                                                        placeholder="e.g., Somali"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="region-code">Short Code *</Label>
                                                    <Input
                                                        id="region-code"
                                                        value={newRegion.code}
                                                        onChange={(e) => setNewRegion({ ...newRegion, code: e.target.value })}
                                                        placeholder="e.g., SO"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddRegion}>Add Region</Button>
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
                                                <TableHead>Region Name</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {regions.map(region => (
                                                <TableRow key={region.id}>
                                                    <TableCell className="font-mono text-sm">{region.id}</TableCell>
                                                    <TableCell className="font-medium">{region.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{region.code}</Badge>
                                                    </TableCell>
                                                    <TableCell>{region.createdAt}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => navigateToRegionalAdmins(region.id)}
                                                                title="Manage Regional Admins"
                                                            >
                                                                <Users className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDeleteRegion(region.id)}
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
                    </TabsContent>

                    {/* Regional Admins Tab */}
                    <TabsContent value="regional-admins">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Regional Admins Management</CardTitle>
                                        <CardDescription>
                                            {selectedRegionId ? `Admins for selected region` : "Manage regional administrators"}
                                        </CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Add Regional Admin
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add Regional Admin</DialogTitle>
                                                <DialogDescription>Assign an admin to a region</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-region">Region *</Label>
                                                    <Select
                                                        value={newRegionalAdmin.regionId}
                                                        onValueChange={(value) => setNewRegionalAdmin({ ...newRegionalAdmin, regionId: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select region" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {regions.map(region => (
                                                                <SelectItem key={region.id} value={region.id}>
                                                                    {region.name} ({region.code})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-name">Admin Name *</Label>
                                                    <Input
                                                        id="admin-name"
                                                        value={newRegionalAdmin.name}
                                                        onChange={(e) => setNewRegionalAdmin({ ...newRegionalAdmin, name: e.target.value })}
                                                        placeholder="e.g., John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-email">Admin Email *</Label>
                                                    <Input
                                                        id="admin-email"
                                                        type="email"
                                                        value={newRegionalAdmin.email}
                                                        onChange={(e) => setNewRegionalAdmin({ ...newRegionalAdmin, email: e.target.value })}
                                                        placeholder="e.g., admin@region.gov.et"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-phone">Admin Phone</Label>
                                                    <Input
                                                        id="admin-phone"
                                                        value={newRegionalAdmin.phone}
                                                        onChange={(e) => setNewRegionalAdmin({ ...newRegionalAdmin, phone: e.target.value })}
                                                        placeholder="e.g., +251 11 123 4567"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddRegionalAdmin}>Add Admin</Button>
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
                                                <TableHead>Region</TableHead>
                                                <TableHead>Admin Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {regionalAdmins
                                                .filter(admin => !selectedRegionId || admin.regionId === selectedRegionId)
                                                .map(admin => (
                                                    <TableRow key={admin.id}>
                                                        <TableCell className="font-mono text-sm">{admin.id}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                                <span>{admin.regionName}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                                        <TableCell>{admin.email}</TableCell>
                                                        <TableCell>{admin.phone}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button size="sm" variant="outline">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleDeleteRegionalAdmin(admin.id)}
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
                    </TabsContent>

                    {/* Universities Tab */}
                    <TabsContent value="universities">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Universities Management</CardTitle>
                                        <CardDescription>Manage system universities</CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add University
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New University</DialogTitle>
                                                <DialogDescription>Register a new university in the system</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="uni-name">University Name *</Label>
                                                    <Input
                                                        id="uni-name"
                                                        value={newUniversity.name}
                                                        onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })}
                                                        placeholder="e.g., Haramaya University"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="uni-abbr">Abbreviation *</Label>
                                                    <Input
                                                        id="uni-abbr"
                                                        value={newUniversity.abbreviation}
                                                        onChange={(e) => setNewUniversity({ ...newUniversity, abbreviation: e.target.value })}
                                                        placeholder="e.g., HU"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddUniversity}>Add University</Button>
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
                                                <TableHead>University Name</TableHead>
                                                <TableHead>Abbreviation</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {universities.map(uni => (
                                                <TableRow key={uni.id}>
                                                    <TableCell className="font-mono text-sm">{uni.id}</TableCell>
                                                    <TableCell className="font-medium">{uni.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{uni.abbreviation}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={uni.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                                                            {uni.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => navigateToUniversityAdmins(uni.id)}
                                                                title="Manage University Admins"
                                                            >
                                                                <Users className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDeleteUniversity(uni.id)}
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
                    </TabsContent>

                    {/* University Admins Tab */}
                    <TabsContent value="university-admins">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>University Admins Management</CardTitle>
                                        <CardDescription>
                                            {selectedUniversityId ? `Admins for selected university` : "Manage university administrators"}
                                        </CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Add University Admin
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add University Admin</DialogTitle>
                                                <DialogDescription>Assign an admin to a university</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="uni-admin-university">University *</Label>
                                                    <Select
                                                        value={newUniversityAdmin.universityId}
                                                        onValueChange={(value) => setNewUniversityAdmin({ ...newUniversityAdmin, universityId: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select university" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {universities.map(uni => (
                                                                <SelectItem key={uni.id} value={uni.id}>
                                                                    {uni.name} ({uni.abbreviation})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="uni-admin-name">Admin Name *</Label>
                                                    <Input
                                                        id="uni-admin-name"
                                                        value={newUniversityAdmin.name}
                                                        onChange={(e) => setNewUniversityAdmin({ ...newUniversityAdmin, name: e.target.value })}
                                                        placeholder="e.g., Dr. Samuel"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="uni-admin-email">Admin Email *</Label>
                                                    <Input
                                                        id="uni-admin-email"
                                                        type="email"
                                                        value={newUniversityAdmin.email}
                                                        onChange={(e) => setNewUniversityAdmin({ ...newUniversityAdmin, email: e.target.value })}
                                                        placeholder="e.g., admin@university.edu.et"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="uni-admin-phone">Admin Phone</Label>
                                                    <Input
                                                        id="uni-admin-phone"
                                                        value={newUniversityAdmin.phone}
                                                        onChange={(e) => setNewUniversityAdmin({ ...newUniversityAdmin, phone: e.target.value })}
                                                        placeholder="e.g., +251 11 123 4567"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddUniversityAdmin}>Add Admin</Button>
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
                                                <TableHead>University</TableHead>
                                                <TableHead>Admin Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {universityAdmins
                                                .filter(admin => !selectedUniversityId || admin.universityId === selectedUniversityId)
                                                .map(admin => (
                                                    <TableRow key={admin.id}>
                                                        <TableCell className="font-mono text-sm">{admin.id}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Building className="w-4 h-4 text-purple-500" />
                                                                <span>{admin.universityName}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                                        <TableCell>{admin.email}</TableCell>
                                                        <TableCell>{admin.phone}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button size="sm" variant="outline">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleDeleteUniversityAdmin(admin.id)}
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
                    </TabsContent>

                    {/* Placements Tab */}
                    <TabsContent value="placements">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Placement Management</CardTitle>
                                        <CardDescription>Initiate and manage placement processes</CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Initiate Placement
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Initiate New Placement</DialogTitle>
                                                <DialogDescription>Start a new placement process</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="placement-name">Placement Name *</Label>
                                                    <Input
                                                        id="placement-name"
                                                        value={newPlacement.name}
                                                        onChange={(e) => setNewPlacement({ ...newPlacement, name: e.target.value })}
                                                        placeholder="e.g., 2024 University Placement"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="placement-year">Academic Year</Label>
                                                    <Select
                                                        value={newPlacement.academicYear}
                                                        onValueChange={(value) => setNewPlacement({ ...newPlacement, academicYear: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="2024">2024</SelectItem>
                                                            <SelectItem value="2025">2025</SelectItem>
                                                            <SelectItem value="2026">2026</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleInitiatePlacement}>Create Placement</Button>
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
                                                <TableHead>Placement Name</TableHead>
                                                <TableHead>Academic Year</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Started</TableHead>
                                                <TableHead>Completed</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {placements.map(placement => (
                                                <TableRow key={placement.id}>
                                                    <TableCell className="font-medium">{placement.name}</TableCell>
                                                    <TableCell>{placement.academicYear}</TableCell>
                                                    <TableCell>
                                                        {placement.status === "done" ? (
                                                            <Badge className="bg-green-500">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Done
                                                            </Badge>
                                                        ) : placement.status === "started" ? (
                                                            <Badge className="bg-blue-500">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                Started
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">Not Started</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{placement.startedAt || "-"}</TableCell>
                                                    <TableCell>{placement.completedAt || "-"}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {placement.status === "not_started" && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleStartPlacement(placement.id)}
                                                                >
                                                                    Start
                                                                </Button>
                                                            )}
                                                            {placement.status === "started" && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => handleCompletePlacement(placement.id)}
                                                                >
                                                                    Mark Done
                                                                </Button>
                                                            )}
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
                </Tabs>
            </main>
        </div>
    )
}