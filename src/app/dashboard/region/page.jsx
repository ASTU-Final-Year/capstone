"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  UserPlus,
  Shield,
  GraduationCap,
  ChartBar,
} from "lucide-react";
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
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function RegionDashboard() {
  const router = useRouter();

  // State
  const [region, setRegion] = useState(null);
  const [cities, setCities] = useState([]);
  const [cityAdmins, setCityAdmins] = useState([]);
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState(null);

  // Form states
  const [newCity, setNewCity] = useState({
    name: "",
    longitude: 0,
    latitude: 0,
  });

  const [newCityAdmin, setNewCityAdmin] = useState({
    cityId: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "male",
  });

  // Check authentication and get region admin data
  useEffect(() => {
    const checkAuthAndLoadRegion = async () => {
      try {
        const sessionResponse = await api.auth.getCurrentSession();
        console.log("Region admin auth check:", sessionResponse);

        if (
          !sessionResponse.success ||
          !sessionResponse.session ||
          !sessionResponse.session.user
        ) {
          toast.error("Please login first");
          router.push("/login");
          return;
        }

        const user = sessionResponse.session.user;
        console.log("Region admin authenticated as:", user.role);

        // Check if user is region_admin
        if (user.role !== "region_admin") {
          toast.error("Access denied. Region admin required.");
          router.push("/login");
          return;
        }

        // Get admin details to find target region
        const adminDetails = await api.admin.getAdminByUserId(user.id);
        const admin = adminDetails && adminDetails.user.admin;
        if (!adminDetails || !admin.targetId) {
          toast.error("Region assignment not found");
          router.push("/login");
          return;
        }

        setAuthLoading(false);
        loadRegionData(admin.targetId);
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Please login first");
        router.push("/login");
      }
    };

    checkAuthAndLoadRegion();
  }, [router]);

  // Load region data
  const loadRegionData = async (regionId) => {
    try {
      setLoading(true);

      // Load region details
      const regionRes = await api.region.getRegionDetails(regionId);
      setRegion(regionRes.region);
      //   console.log(regionRes.region);

      // Load cities in region
      setCities(regionRes.region.cities || []);

      // Load city admins
      const cityAdminsRes = await api.admin.getAdminsByRoleAndTarget(
        "city_admin",
        regionId,
      );
      console.log(cityAdminsRes);
      setCityAdmins(cityAdminsRes.admins || []);

      // Load regional statistics
      const statsRes = await api.region.getRegionalStats(regionId);
      setStatistics(statsRes);

      // Load schools (you may need to implement this)
      // const schoolsRes = await api.region.getSchools(regionId);
      // setSchools(schoolsRes || []);

      // Load students (you may need to implement this)
      // const studentsRes = await api.region.getStudents(regionId);
      // setStudents(studentsRes || []);
    } catch (error) {
      toast.error("Failed to load region data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Add new city
  const handleAddCity = async () => {
    if (!newCity.name || !region?.id) {
      toast.error("City name is required");
      return;
    }

    try {
      const response = await api.region.createCity(
        region.id,
        newCity.name,
        newCity.longitude || 0,
        newCity.latitude || 0,
      );

      if (response.success) {
        toast.success("City added successfully");
        setCities([...cities, response.city]);
        setNewCity({ name: "", longitude: 0, latitude: 0 });

        // Close dialog
        document
          .querySelector('[data-state="open"]')
          ?.querySelector("[data-dialog-close]")
          ?.click();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add city");
    }
  };

  // Add city admin
  const handleAddCityAdmin = async () => {
    if (
      !newCityAdmin.cityId ||
      !newCityAdmin.name ||
      !newCityAdmin.email ||
      !newCityAdmin.password
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await api.superAdmin.createAdmin({
        role: "city_admin",
        targetId: newCityAdmin.cityId,
        fullname: newCityAdmin.name,
        email: newCityAdmin.email,
        password: newCityAdmin.password,
        gender: newCityAdmin.gender,
        phone: newCityAdmin.phone,
      });

      if (response.success) {
        toast.success("City admin added successfully");
        setCityAdmins([
          ...cityAdmins,
          {
            ...response.admin,
            user: response.user,
            cityName:
              cities.find((c) => c.id === newCityAdmin.cityId)?.name ||
              "Unknown City",
          },
        ]);
        setNewCityAdmin({
          cityId: "",
          name: "",
          email: "",
          phone: "",
          password: "",
          gender: "male",
        });

        // Close dialog
        document
          .querySelector('[data-state="open"]')
          ?.querySelector("[data-dialog-close]")
          ?.click();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add city admin");
    }
  };

  // Delete city
  const handleDeleteCity = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this city? This will delete all associated data.",
      )
    ) {
      return;
    }

    try {
      const response = await api.region.deleteCity(id);
      if (response.success) {
        toast.success("City deleted successfully");
        setCities(cities.filter((city) => city.id !== id));
        // Remove city admins for this city
        setCityAdmins(cityAdmins.filter((admin) => admin.targetId !== id));
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete city");
    }
  };

  // Delete city admin
  const handleDeleteCityAdmin = async (id, userId) => {
    if (!confirm("Are you sure you want to remove this admin?")) {
      return;
    }

    try {
      const response = await api.superAdmin.demoteAdmin(id, userId);
      if (response.success) {
        toast.success("City admin removed successfully");
        setCityAdmins(cityAdmins.filter((admin) => admin.id !== id));
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove admin");
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      api.clearToken();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  const navigateToCityAdmins = (cityId) => {
    setSelectedCityId(cityId);
    const tabs = document.querySelector('[data-state="active"]');
    if (tabs) {
      const cityAdminsTab = document.querySelector('[value="city-admins"]');
      if (cityAdminsTab) {
        cityAdminsTab.click();
      }
    }
  };

  // Calculate averages for display
  const calculateAverages = () => {
    if (!cities.length || !statistics) return null;

    return {
      avgSchoolsPerCity:
        Math.round(statistics.totalSchools / statistics.totalCities) || 0,
      avgStudentsPerCity:
        Math.round(statistics.totalStudents / statistics.totalCities) || 0,
      adminCoverage: Math.round((cityAdmins.length / cities.length) * 100) || 0,
      placementRate: "94%", // This would come from your backend
    };
  };

  const averages = calculateAverages();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading Region Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Region data not found</p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Return to Login
          </Button>
        </div>
      </div>
    );
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
                <h1 className="text-xl font-bold text-gray-900">
                  {region.name} Region Dashboard
                </h1>
                <p className="text-sm text-gray-500">Regional Administration</p>
              </div>
              <Badge
                variant="outline"
                className="ml-2 bg-green-50 text-green-700 border-green-200"
              >
                Region Admin
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{region.name}</p>
                <p className="text-xs text-green-600">● Active</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadRegionData(region.id)}
              >
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="city-admins">City Admins</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                    <p className="text-3xl font-bold">
                      {statistics?.totalCities || cities.length}
                    </p>
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
                    <p className="text-3xl font-bold">
                      {statistics?.totalSchools || 0}
                    </p>
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
                    <p className="text-3xl font-bold">
                      {statistics?.totalStudents?.toLocaleString() || 0}
                    </p>
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
                    <p className="text-3xl font-bold">
                      {averages?.placementRate || "0%"}
                    </p>
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
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Active Students</p>
                        <p className="font-medium">
                          {statistics?.activeStudents?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <Building className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Total Universities
                        </p>
                        <p className="font-medium">
                          {statistics?.totalUniversities || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <ChartBar className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submissions</p>
                        <p className="font-medium">
                          {statistics?.totalSubmissions || 0}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Admin Coverage</p>
                        <p className="font-medium">
                          {averages?.adminCoverage || 0}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {cityAdmins.length} admins across {cities.length}{" "}
                          cities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Cities */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Cities</CardTitle>
                <CardDescription>
                  Recently added cities in {region.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {cities.slice(0, 3).map((city) => (
                    <div key={city.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{city.name}</p>
                          <p className="text-sm text-gray-500">
                            Coordinates: {city.latitude?.toFixed(4)},{" "}
                            {city.longitude?.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Schools</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Students</span>
                        <span className="font-medium">0</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cities Tab */}
          <TabsContent value="cities">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Cities Management</CardTitle>
                    <CardDescription>
                      Register and manage cities in {region.name} region
                    </CardDescription>
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
                        <DialogDescription>
                          Register a new city in {region.name} region
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="city-name">City Name *</Label>
                          <Input
                            id="city-name"
                            value={newCity.name}
                            onChange={(e) =>
                              setNewCity({ ...newCity, name: e.target.value })
                            }
                            placeholder="e.g., Hawassa"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city-longitude">Longitude</Label>
                            <Input
                              id="city-longitude"
                              type="number"
                              step="0.000001"
                              value={newCity.longitude}
                              onChange={(e) =>
                                setNewCity({
                                  ...newCity,
                                  longitude: parseFloat(e.target.value) || 0,
                                })
                              }
                              placeholder="e.g., 7.005401"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city-latitude">Latitude</Label>
                            <Input
                              id="city-latitude"
                              type="number"
                              step="0.000001"
                              value={newCity.latitude}
                              onChange={(e) =>
                                setNewCity({
                                  ...newCity,
                                  latitude: parseFloat(e.target.value) || 0,
                                })
                              }
                              placeholder="e.g., 38.763611"
                            />
                          </div>
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
                        <TableHead>City Name</TableHead>
                        <TableHead>Coordinates</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <MapPin className="w-12 h-12 text-gray-400 mb-4" />
                              <p className="text-gray-500">
                                No cities registered yet
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                Add your first city to get started
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        cities.map((city) => (
                          <TableRow key={city.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                {city.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                {city.latitude?.toFixed(4)},{" "}
                                {city.longitude?.toFixed(4)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-500">
                                {new Date(city.createdAt).toLocaleDateString()}
                              </span>
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
                        ))
                      )}
                    </TableBody>
                  </Table>
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
                      {selectedCityId
                        ? `Admins for selected city`
                        : `Manage city administrators in ${region.name} region`}
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add City Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add City Admin</DialogTitle>
                        <DialogDescription>
                          Assign an admin to a city
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="admin-city">City *</Label>
                          <Select
                            value={newCityAdmin.cityId}
                            onValueChange={(value) =>
                              setNewCityAdmin({
                                ...newCityAdmin,
                                cityId: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city.id} value={city.id}>
                                  {city.name}
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
                            onChange={(e) =>
                              setNewCityAdmin({
                                ...newCityAdmin,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-email">Admin Email *</Label>
                          <Input
                            id="admin-email"
                            type="email"
                            value={newCityAdmin.email}
                            onChange={(e) =>
                              setNewCityAdmin({
                                ...newCityAdmin,
                                email: e.target.value,
                              })
                            }
                            placeholder="e.g., admin@city.gov.et"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-password">
                            Admin Password *
                          </Label>
                          <Input
                            id="admin-password"
                            type="password"
                            value={newCityAdmin.password}
                            onChange={(e) =>
                              setNewCityAdmin({
                                ...newCityAdmin,
                                password: e.target.value,
                              })
                            }
                            placeholder="Create a password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-phone">Admin Phone</Label>
                          <Input
                            id="admin-phone"
                            value={newCityAdmin.phone}
                            onChange={(e) =>
                              setNewCityAdmin({
                                ...newCityAdmin,
                                phone: e.target.value,
                              })
                            }
                            placeholder="e.g., +251 11 123 4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-gender">Gender</Label>
                          <Select
                            value={newCityAdmin.gender}
                            onValueChange={(value) =>
                              setNewCityAdmin({
                                ...newCityAdmin,
                                gender: value,
                              })
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
                        <TableHead>Admin Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cityAdmins.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <Users className="w-12 h-12 text-gray-400 mb-4" />
                              <p className="text-gray-500">
                                No city admins assigned yet
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                Assign admins to cities to manage schools and
                                students
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        cityAdmins
                          .filter(
                            (admin) =>
                              !selectedCityId ||
                              admin.targetId === selectedCityId,
                          )
                          .map((admin) => (
                            <TableRow key={admin.id}>
                              <TableCell className="font-medium">
                                {admin.user?.fullname}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-blue-500" />
                                  <span>
                                    {admin.cityName ||
                                      cities.find(
                                        (c) => c.id === admin.targetId,
                                      )?.name ||
                                      "Unknown City"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm">
                                    {admin.user?.email}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm">
                                    {admin.user?.phone || "Not provided"}
                                  </span>
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
                                    onClick={() =>
                                      handleDeleteCityAdmin(
                                        admin.id,
                                        admin.userId,
                                      )
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <CardTitle>Schools in {region.name}</CardTitle>
                <CardDescription>
                  Schools across all cities in the region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>School Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Students</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schools.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <School className="w-12 h-12 text-gray-400 mb-4" />
                              <p className="text-gray-500">
                                No schools data available
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                Schools will appear here when city admins add
                                them
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        schools.map((school) => (
                          <TableRow key={school.id}>
                            <TableCell className="font-medium">
                              {school.name}
                            </TableCell>
                            <TableCell>
                              {school.city?.name || "Unknown"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{school.type}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {school.code}
                            </TableCell>
                            <TableCell>0</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Region Analytics</CardTitle>
                <CardDescription>
                  Statistical overview of {region.name} region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Statistics Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Average Schools per City
                      </p>
                      <p className="text-xl font-bold mt-1">
                        {averages?.avgSchoolsPerCity || 0}
                      </p>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Average Students per City
                      </p>
                      <p className="text-xl font-bold mt-1">
                        {averages?.avgStudentsPerCity?.toLocaleString() || 0}
                      </p>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <PieChart className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-sm text-gray-500">Admin Coverage</p>
                      <p className="text-xl font-bold mt-1">
                        {averages?.adminCoverage || 0}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {cityAdmins.length} admins / {cities.length} cities
                      </p>
                    </div>
                  </div>

                  {/* City Distribution Chart */}
                  <div>
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <ChartBar className="w-5 h-5" />
                      City Distribution
                    </h3>
                    <div className="space-y-3">
                      {cities.map((city) => {
                        // For now, using placeholder percentages
                        const percentage =
                          cities.length > 0 ? 100 / cities.length : 0;
                        return (
                          <div key={city.id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{city.name}</span>
                              <span className="text-gray-600">
                                0 students ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Export Options */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold">Export Region Data</h3>
                          <p className="text-sm text-gray-500">
                            Download reports and data for {region.name} region
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Cities Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Admins List
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Statistics
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
  );
}
