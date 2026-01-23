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
    MapPin,
    Users,
    Building,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    Download,
    BarChart3,
    Home,
    School,
    Target,
    PieChart,
    User,
    Mail,
    Phone,
    Map,
    UserPlus
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegionDashboard() {
    const router = useRouter()

    // Region data
    const [region, setRegion] = useState({
        id: "reg_001",
        name: "Addis Ababa",
        code: "AA",
        totalCities: 3,
        totalSchools: 245,
        totalStudents: 45200,
        governor: "Dr. Adanech Abiebie",
        placementRate: "94%"
    })

    // Cities data
    const [cities, setCities] = useState([])

    // City Admins data
    const [cityAdmins, setCityAdmins] = useState([])

    // Form states
    const [newCity, setNewCity] = useState({
        name: "",
        code: ""
    })

    const [newCityAdmin, setNewCityAdmin] = useState({
        cityId: "",
        name: "",
        email: ""
    })

    const [loading, setLoading] = useState(true)
    const [selectedCityId, setSelectedCityId] = useState(null)

    useEffect(() => {
        setTimeout(() => {
            // Mock cities data
            const mockCities = [
                {
                    id: "city_001",
                    name: "Addis Ababa",
                    code: "AA",
                    totalSchools: 245,
                    totalStudents: 45200,
                    createdAt: "2024-01-15"
                },
                {
                    id: "city_002",
                    name: "Adama",
                    code: "AD",
                    totalSchools: 120,
                    totalStudents: 18500,
                    createdAt: "2024-01-14"
                },
                {
                    id: "city_003",
                    name: "Debre Birhan",
                    code: "DB",
                    totalSchools: 85,
                    totalStudents: 12800,
                    createdAt: "2024-01-13"
                }
            ]

            // Mock city admins data
            const mockCityAdmins = [
                {
                    id: "cadm_001",
                    cityId: "city_001",
                    cityName: "Addis Ababa",
                    name: "Michael Getachew",
                    email: "admin@addis.gov.et",
                    phone: "+251 11 123 4567"
                },
                {
                    id: "cadm_002",
                    cityId: "city_002",
                    cityName: "Adama",
                    name: "Sarah Johnson",
                    email: "admin@adama.gov.et",
                    phone: "+251 22 234 5678"
                },
                {
                    id: "cadm_003",
                    cityId: "city_003",
                    cityName: "Debre Birhan",
                    name: "David Smith",
                    email: "admin@debrebirhan.gov.et",
                    phone: "+251 22 345 6789"
                }
            ]

            setCities(mockCities)
            setCityAdmins(mockCityAdmins)
            setLoading(false)
        }, 500)
    }, [])

    const handleAddCity = () => {
        if (!newCity.name || !newCity.code) {
            alert("Please fill all fields")
            return
        }

        const newCityObj = {
            id: `city_${String(cities.length + 1).padStart(3, '0')}`,
            name: newCity.name,
            code: newCity.code,
            totalSchools: 0,
            totalStudents: 0,
            createdAt: new Date().toISOString().split('T')[0]
        }

        setCities([...cities, newCityObj])
        setRegion(prev => ({
            ...prev,
            totalCities: prev.totalCities + 1
        }))
        setNewCity({ name: "", code: "" })
    }

    const handleAddCityAdmin = () => {
        if (!newCityAdmin.cityId || !newCityAdmin.name || !newCityAdmin.email) {
            alert("Please fill all required fields")
            return
        }

        const city = cities.find(c => c.id === newCityAdmin.cityId)
        const newAdminObj = {
            id: `cadm_${String(cityAdmins.length + 1).padStart(3, '0')}`,
            cityId: newCityAdmin.cityId,
            cityName: city?.name || "Unknown City",
            name: newCityAdmin.name,
            email: newCityAdmin.email,
            phone: ""
        }

        setCityAdmins([...cityAdmins, newAdminObj])
        setNewCityAdmin({ cityId: "", name: "", email: "" })
    }

    const handleDeleteCity = (id) => {
        setCities(cities.filter(city => city.id !== id))
        // Also remove city admins for this city
        setCityAdmins(cityAdmins.filter(admin => admin.cityId !== id))
        setRegion(prev => ({
            ...prev,
            totalCities: Math.max(0, prev.totalCities - 1)
        }))
    }

    const handleDeleteCityAdmin = (id) => {
        setCityAdmins(cityAdmins.filter(admin => admin.id !== id))
    }

    const navigateToCityAdmins = (cityId) => {
        setSelectedCityId(cityId)
        const tabs = document.querySelector('[data-state="active"]')
        if (tabs) {
            const cityAdminsTab = document.querySelector('[value="city-admins"]')
            if (cityAdminsTab) {
                cityAdminsTab.click()
            }
        }
    }

    const handleLogout = () => {
        router.push("/login")
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading Region Dashboard...</p>
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
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                <Map className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{region.name} Region Dashboard</h1>
                                <p className="text-sm text-gray-500">Regional Administration</p>
                            </div>
                            <Badge variant="outline" className="ml-2">Region Admin</Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6">
                <Tabs defaultValue="cities" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="cities">Cities</TabsTrigger>
                        <TabsTrigger value="city-admins">City Admins</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab - Optional */}
                    <TabsContent value="overview">
                        <div className="grid md:grid-cols-4 gap-6 mb-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MapPin className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{region.totalCities}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total Cities</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <School className="w-6 h-6 text-green-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{region.totalSchools}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total Schools</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{region.totalStudents.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500 mt-2">Total Students</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Target className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <p className="text-3xl font-bold">{region.placementRate}</p>
                                        <p className="text-sm text-gray-500 mt-2">Placement Rate</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Region Information</CardTitle>
                                <CardDescription>{region.name} Region Details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <MapPin className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Region Name</p>
                                                <p className="font-medium">{region.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <Home className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Region Code</p>
                                                <p className="font-medium">{region.code}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-purple-50 rounded-lg">
                                                <User className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Regional Governor</p>
                                                <p className="font-medium">{region.governor}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-amber-50 rounded-lg">
                                                <Building className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Largest City</p>
                                                <p className="font-medium">Addis Ababa</p>
                                                <p className="text-xs text-gray-500">245 schools, 45,200 students</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Cities Tab - Main Feature */}
                    <TabsContent value="cities">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>Cities Management</CardTitle>
                                        <CardDescription>Register and manage cities in {region.name} region</CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add City
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add New City</DialogTitle>
                                                <DialogDescription>Register a new city in {region.name} region</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="city-name">City Name *</Label>
                                                    <Input
                                                        id="city-name"
                                                        value={newCity.name}
                                                        onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                                                        placeholder="e.g., Hawassa"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="city-code">City Code *</Label>
                                                    <Input
                                                        id="city-code"
                                                        value={newCity.code}
                                                        onChange={(e) => setNewCity({ ...newCity, code: e.target.value })}
                                                        placeholder="e.g., HA"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddCity}>Add City</Button>
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
                                                <TableHead>City Name</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead>Schools</TableHead>
                                                <TableHead>Students</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cities.map(city => (
                                                <TableRow key={city.id}>
                                                    <TableCell className="font-mono text-sm">{city.id}</TableCell>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-blue-500" />
                                                            {city.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{city.code}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{city.totalSchools}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{city.totalStudents.toLocaleString()}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm">{city.createdAt}</span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => navigateToCityAdmins(city.id)}
                                                                title="Manage City Admins"
                                                            >
                                                                <Users className="w-4 h-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDeleteCity(city.id)}
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

                        {/* Quick City Stats */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>City Statistics</CardTitle>
                                <CardDescription>Quick overview of cities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {Math.max(...cities.map(c => c.totalSchools))}
                                        </div>
                                        <div className="text-sm text-gray-500">Most Schools in a City</div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {cities.find(c => c.totalSchools === Math.max(...cities.map(c => c.totalSchools)))?.name}
                                        </div>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {Math.max(...cities.map(c => c.totalStudents))?.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-500">Most Students in a City</div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {cities.find(c => c.totalStudents === Math.max(...cities.map(c => c.totalStudents)))?.name}
                                        </div>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {cities.length}
                                        </div>
                                        <div className="text-sm text-gray-500">Total Cities</div>
                                        <div className="text-xs text-gray-400 mt-1">In this region</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* City Admins Tab */}
                    <TabsContent value="city-admins">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle>City Admins Management</CardTitle>
                                        <CardDescription>
                                            {selectedCityId ?
                                                `Admins for selected city` :
                                                "Manage city administrators in " + region.name + " region"
                                            }
                                        </CardDescription>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Add City Admin
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Add City Admin</DialogTitle>
                                                <DialogDescription>Assign an admin to a city</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-city">City *</Label>
                                                    <Select
                                                        value={newCityAdmin.cityId}
                                                        onValueChange={(value) => setNewCityAdmin({ ...newCityAdmin, cityId: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select city" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {cities.map(city => (
                                                                <SelectItem key={city.id} value={city.id}>
                                                                    {city.name} ({city.code})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-name">Admin Name *</Label>
                                                    <Input
                                                        id="admin-name"
                                                        value={newCityAdmin.name}
                                                        onChange={(e) => setNewCityAdmin({ ...newCityAdmin, name: e.target.value })}
                                                        placeholder="e.g., John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-email">Admin Email *</Label>
                                                    <Input
                                                        id="admin-email"
                                                        type="email"
                                                        value={newCityAdmin.email}
                                                        onChange={(e) => setNewCityAdmin({ ...newCityAdmin, email: e.target.value })}
                                                        placeholder="e.g., admin@city.gov.et"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleAddCityAdmin}>Add Admin</Button>
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
                                                <TableHead>City</TableHead>
                                                <TableHead>Admin Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cityAdmins
                                                .filter(admin => !selectedCityId || admin.cityId === selectedCityId)
                                                .map(admin => (
                                                    <TableRow key={admin.id}>
                                                        <TableCell className="font-mono text-sm">{admin.id}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                                <span>{admin.cityName}</span>
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
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button size="sm" variant="outline">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleDeleteCityAdmin(admin.id)}
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

                        {/* Admin Statistics */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Admin Statistics</CardTitle>
                                <CardDescription>Overview of city administrators</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {cityAdmins.length}
                                        </div>
                                        <div className="text-sm text-gray-500">Total City Admins</div>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {new Set(cityAdmins.map(a => a.cityId)).size}
                                        </div>
                                        <div className="text-sm text-gray-500">Cities with Admins</div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            out of {cities.length} total cities
                                        </div>
                                    </div>

                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {cities.length - new Set(cityAdmins.map(a => a.cityId)).size}
                                        </div>
                                        <div className="text-sm text-gray-500">Cities without Admins</div>
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
                                <CardTitle>Region Analytics</CardTitle>
                                <CardDescription>Optional analytics for {region.name} region</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* City Distribution */}
                                    <div>
                                        <h3 className="font-bold mb-4">Student Distribution by City</h3>
                                        <div className="space-y-3">
                                            {cities.map(city => {
                                                const percentage = (city.totalStudents / region.totalStudents) * 100
                                                return (
                                                    <div key={city.id} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>{city.name}</span>
                                                            <span>{city.totalStudents.toLocaleString()} students ({percentage.toFixed(1)}%)</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Quick Analytics */}
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <p className="text-sm text-gray-500">Average Schools per City</p>
                                            <p className="text-xl font-bold mt-1">
                                                {(region.totalSchools / region.totalCities).toFixed(1)}
                                            </p>
                                        </div>

                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Users className="w-5 h-5 text-green-600" />
                                            </div>
                                            <p className="text-sm text-gray-500">Average Students per City</p>
                                            <p className="text-xl font-bold mt-1">
                                                {(region.totalStudents / region.totalCities).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="text-center p-4 border rounded-lg">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <PieChart className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <p className="text-sm text-gray-500">Admin Coverage</p>
                                            <p className="text-xl font-bold mt-1">
                                                {((new Set(cityAdmins.map(a => a.cityId)).size / cities.length) * 100).toFixed(0)}%
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">Cities with admins</p>
                                        </div>
                                    </div>

                                    {/* Export Options */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="font-bold">Export Region Data</h3>
                                                    <p className="text-sm text-gray-500">Download region reports and data</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Cities List
                                                    </Button>
                                                    <Button variant="outline">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Admins List
                                                    </Button>
                                                    <Button variant="outline">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Statistics Report
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