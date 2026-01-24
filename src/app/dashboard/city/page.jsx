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
  School,
  Users,
  Building,
  Plus,
  Edit,
  Trash2,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  GraduationCap,
  Calendar,
  Hash,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Shield,
  Key,
  UserPlus,
  MapIcon,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "@/lib/api";

export default function CityDashboard() {
  const router = useRouter();

  // State
  const [city, setCity] = useState(null);
  const [stats, setStats] = useState(null);
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [schoolAdmins, setSchoolAdmins] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Form states
  const [newSchool, setNewSchool] = useState({
    name: "",
    code: "",
    type: "",
  });

  const [newSchoolAdmin, setNewSchoolAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "male",
    schoolId: "",
  });

  const [editingSchool, setEditingSchool] = useState(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState("all");

  // Check authentication and get city admin data
  useEffect(() => {
    const checkAuthAndLoadCity = async () => {
      try {
        console.log("Starting city admin auth check...");

        // Check session
        const sessionResponse = await api.auth.getCurrentSession();
        console.log("City admin auth check:", sessionResponse);

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
        console.log("City admin authenticated as:", user.role);
        setCurrentUser(user);

        // Check if user is city_admin or super_admin
        if (!["city_admin", "super_admin"].includes(user.role)) {
          toast.error("Access denied. City admin or super admin required.");
          router.push("/login");
          return;
        }

        // Get admin details to find target city
        console.log("Getting admin details for user:", user.id);
        const adminDetails = await api.admin.getAdminByUserId(user.id);
        console.log("Admin details response:", adminDetails);

        // Super admin can access any city, city admin needs targetId
        let targetCityId = null;
        if (user.role === "super_admin") {
          // For super admin, get city from URL params
          const params = new URLSearchParams(window.location.search);
          targetCityId = params.get("cityId") || "demo_city_id";
        } else {
          if (
            !adminDetails ||
            !adminDetails.user ||
            !adminDetails.user.admin ||
            !adminDetails.user.admin.targetId
          ) {
            toast.error("City assignment not found");
            router.push("/login");
            return;
          }
          targetCityId = adminDetails.user.admin.targetId;
        }

        console.log("Found target city ID:", targetCityId);

        setAuthLoading(false);
        await loadCityData(targetCityId);
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Please login first");
        router.push("/login");
      }
    };

    checkAuthAndLoadCity();
  }, [router]);

  const loadCityData = async (cityId) => {
    try {
      setDataLoading(true);
      setError(null);

      console.log("Loading city data for ID:", cityId);

      // Fetch city details
      const cityData = await api.city.getCityDetails(cityId);
      console.log("City details:", cityData);
      setCity(cityData.city);

      // Fetch city statistics
      const statsData = await api.city.getCityStats(cityId);
      console.log("City stats:", statsData);
      setStats(statsData.stats);

      // Fetch schools
      await fetchSchools(cityId);

      // Fetch school admins
      await fetchSchoolAdmins(cityId);

      // // Fetch students
      // await fetchStudents(cityId);

      // // Fetch submissions
      // await fetchSubmissions(cityId);

      console.log("City data loaded successfully");
    } catch (err) {
      console.error("Error loading city data:", err);
      setError(err.message || "Failed to load city data");
      toast.error("Failed to load city dashboard");
    } finally {
      setDataLoading(false);
    }
  };

  // Fixed: Added missing school management functions
  const handleAddSchool = async () => {
    if (!newSchool.name.trim()) {
      toast.error("School name is required");
      return;
    }

    if (!city) {
      toast.error("City not loaded");
      return;
    }

    try {
      const response = await api.city.createSchool(city.id, newSchool);
      if (response.success) {
        toast.success("School added successfully");
        await fetchSchools(city.id);
        setNewSchool({ name: "", code: "", type: "" });
        // Close dialog
        document.getElementById("add-school-dialog-close")?.click();
      }
    } catch (error) {
      console.error("Error adding school:", error);
      toast.error(error.message || "Failed to add school");
    }
  };

  const handleUpdateSchool = async () => {
    if (!editingSchool || !city) return;

    try {
      const response = await api.city.updateSchool(
        city.id,
        editingSchool.id,
        editingSchool,
      );
      if (response.success) {
        toast.success("School updated successfully");
        await fetchSchools(city.id);
        setEditingSchool(null);
      }
    } catch (error) {
      console.error("Error updating school:", error);
      toast.error(error.message || "Failed to update school");
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    if (!confirm("Are you sure you want to delete this school?")) {
      return;
    }

    if (!city) return;

    try {
      const response = await api.city.deleteSchool(city.id, schoolId);
      if (response.success) {
        toast.success("School deleted successfully");
        await fetchSchools(city.id);
      }
    } catch (error) {
      console.error("Error deleting school:", error);
      toast.error(error.message || "Failed to delete school");
    }
  };

  const fetchSchools = async (cityId, page = 1, search = "") => {
    try {
      const data = await api.city.getSchools(cityId, {
        page,
        limit: 20,
        search,
        withStats: true,
      });
      setSchools(data.schools || []);
    } catch (err) {
      console.error("Error fetching schools:", err);
      toast.error("Failed to fetch schools");
    }
  };

  const fetchStudents = async (cityId, page = 1, schoolId) => {
    try {
      const data = await api.city.getStudents(cityId, {
        page,
        limit: 20,
        schoolId: schoolId && schoolId !== "all" ? schoolId : undefined,
        isActive: true,
      });
      setStudents(data.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to fetch students");
    }
  };

  const fetchSubmissions = async (cityId, page = 1, schoolId) => {
    try {
      const data = await api.city.getSubmissions(cityId, {
        page,
        limit: 20,
        schoolId: schoolId && schoolId !== "all" ? schoolId : undefined,
        status: "submitted",
      });
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      toast.error("Failed to fetch submissions");
    }
  };

  const fetchSchoolAdmins = async (cityId) => {
    try {
      const response =
        (await api.admin.getSchoolAdmins?.()) ||
        (await api.superAdmin.getAdminsByRole?.("school_admin"));
      console.log("School admins response:", response);

      // Get school IDs in this city
      // const schoolIdsInCity = schools.map((school) => school.id);

      // console.log(response, schoolIdsInCity);
      // Filter school admins for schools in this city
      const admins = response.admins || response || [];
      // const filteredAdmins = admins.filter(
      //   (admin) => admin.targetId && schoolIdsInCity.includes(admin.targetId),
      // );

      setSchoolAdmins(admins);
    } catch (err) {
      console.error("Error fetching school admins:", err);
    }
  };

  // Add school admin
  const handleAddSchoolAdmin = async () => {
    if (
      !newSchoolAdmin.schoolId ||
      !newSchoolAdmin.name ||
      !newSchoolAdmin.email ||
      !newSchoolAdmin.password ||
      !newSchoolAdmin.phone
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!city) {
      toast.error("City not loaded");
      return;
    }

    try {
      const response = await api.superAdmin.createAdmin({
        role: "school_admin",
        targetId: newSchoolAdmin.schoolId,
        fullname: newSchoolAdmin.name,
        email: newSchoolAdmin.email,
        password: newSchoolAdmin.password,
        gender: newSchoolAdmin.gender,
        phone: newSchoolAdmin.phone,
      });

      if (response.success) {
        toast.success("School admin added successfully");

        // Add to local state
        const schoolName =
          schools.find((s) => s.id === newSchoolAdmin.schoolId)?.name ||
          "Unknown School";
        setSchoolAdmins([
          ...schoolAdmins,
          {
            ...response.admin,
            user: response.user,
            schoolName,
            schoolId: newSchoolAdmin.schoolId,
          },
        ]);

        // Reset form
        setNewSchoolAdmin({
          name: "",
          email: "",
          phone: "",
          password: "",
          gender: "male",
          schoolId: "",
        });

        // Close dialog
        document.getElementById("add-school-admin-dialog-close")?.click();
      }
    } catch (error) {
      console.error("Error adding school admin:", error);
      toast.error(error.message || "Failed to add school admin");
    }
  };

  // Remove school admin
  const handleRemoveSchoolAdmin = async (adminId) => {
    if (!confirm("Are you sure you want to remove this school admin?")) {
      return;
    }

    try {
      setSchoolAdmins(schoolAdmins.filter((admin) => admin.id !== adminId));
      toast.success("School admin removed successfully");
    } catch (err) {
      toast.error("Failed to remove school admin");
    }
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    router.push("/login");
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const getSchoolTypeBadge = (type) => {
    if (!type) return <Badge variant="outline">Unknown</Badge>;

    switch (type.toLowerCase()) {
      case "public":
        return <Badge className="bg-blue-500">Public</Badge>;
      case "private":
        return <Badge className="bg-green-500">Private</Badge>;
      case "international":
        return <Badge className="bg-purple-500">International</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-500">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-500">Loading City Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Alert className="max-w-md" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <div className="flex gap-2 mt-4">
              <Button
                className="flex-1"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-500">City not found</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="mr-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {city.name} City Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {currentUser?.role === "super_admin"
                      ? "Super Admin"
                      : "City Admin"}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {currentUser?.fullname || currentUser?.email}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {city.region?.name || "Unknown Region"} • {schools.length}{" "}
                  Schools • {(stats?.totalStudents || 0).toLocaleString()}{" "}
                  Students
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadCityData(city.id)}
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
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="school-admins">School Admins</TabsTrigger>
            {/* <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger> */}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <School className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold">{schools.length}</p>
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
                    <p className="text-3xl font-bold">
                      {(stats?.totalStudents || 0).toLocaleString()}
                    </p>
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
                    <p className="text-3xl font-bold">
                      {stats?.placementCount || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Placements</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-3xl font-bold">
                      {stats?.submissionsCount || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Submissions</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* City Information */}
              <Card>
                <CardHeader>
                  <CardTitle>City Information</CardTitle>
                  <CardDescription>{city.name} City Details</CardDescription>
                </CardHeader>
                <CardContent>
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
                        <p className="font-medium">
                          {city.region?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Code: {city.region?.code || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <Hash className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Coordinates</p>
                        <p className="font-medium">
                          {city.latitude?.toFixed(4) || "N/A"},{" "}
                          {city.longitude?.toFixed(4) || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Key metrics at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Active Students
                      </span>
                      <span className="font-medium">
                        {stats?.activeStudents || 0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Average GPA</span>
                      <span className="font-medium">
                        {typeof stats?.averageGPA === "number"
                          ? stats.averageGPA.toFixed(2)
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Schools with Admins
                      </span>
                      <span className="font-medium">
                        {new Set(schoolAdmins.map((a) => a.schoolId)).size} /{" "}
                        {schools.length}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Submission Rate
                      </span>
                      <span className="font-medium">
                        {stats?.totalStudents > 0
                          ? (
                              ((stats?.submissionsCount || 0) /
                                (stats?.totalStudents || 1)) *
                              100
                            ).toFixed(1) + "%"
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schools Tab */}
          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Schools Management</CardTitle>
                    <CardDescription>
                      Register and manage schools in {city.name}
                    </CardDescription>
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
                        <DialogDescription>
                          Add a new school in {city.name} city
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="school-name">School Name *</Label>
                          <Input
                            id="school-name"
                            value={newSchool.name}
                            onChange={(e) =>
                              setNewSchool({
                                ...newSchool,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., St. Mary School"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="school-code">School Code</Label>
                          <Input
                            id="school-code"
                            value={newSchool.code}
                            onChange={(e) =>
                              setNewSchool({
                                ...newSchool,
                                code: e.target.value,
                              })
                            }
                            placeholder="e.g., SMS001"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="school-type">School Type</Label>
                          <Select
                            value={newSchool.type}
                            onValueChange={(value) =>
                              setNewSchool({ ...newSchool, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select school type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">
                                Public School
                              </SelectItem>
                              <SelectItem value="private">
                                Private School
                              </SelectItem>
                              <SelectItem value="international">
                                International School
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          id="add-school-dialog-close"
                          variant="outline"
                          className="hidden"
                        >
                          Close
                        </Button>
                        <Button onClick={handleAddSchool}>
                          Register School
                        </Button>
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
                        <TableHead>School Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Avg GPA</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schools.map((school) => (
                        <TableRow key={school.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <School className="w-4 h-4 text-blue-500" />
                              {school.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {school.code ? (
                              <Badge variant="outline">{school.code}</Badge>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getSchoolTypeBadge(school.type)}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {school.studentCount || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {typeof stats?.averageGPA === "number"
                                ? stats.averageGPA.toFixed(2)
                                : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {school.submissionsCount || 0}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedSchoolId(school.id)}
                                title="Manage Admins"
                              >
                                <Users className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingSchool(school)}
                              >
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

            {/* Edit School Dialog */}
            {editingSchool && (
              <Dialog
                open={!!editingSchool}
                onOpenChange={() => setEditingSchool(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit School</DialogTitle>
                    <DialogDescription>
                      Update school information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-school-name">School Name</Label>
                      <Input
                        id="edit-school-name"
                        value={editingSchool.name}
                        onChange={(e) =>
                          setEditingSchool({
                            ...editingSchool,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-school-code">School Code</Label>
                      <Input
                        id="edit-school-code"
                        value={editingSchool.code || ""}
                        onChange={(e) =>
                          setEditingSchool({
                            ...editingSchool,
                            code: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-school-type">School Type</Label>
                      <Select
                        value={editingSchool.type}
                        onValueChange={(value) =>
                          setEditingSchool({ ...editingSchool, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select school type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="international">
                            International
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setEditingSchool(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateSchool}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* School Admins Tab */}
          <TabsContent value="school-admins">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>School Admins Management</CardTitle>
                    <CardDescription>
                      Manage school administrators in {city.name}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={selectedSchoolId}
                      onValueChange={(value) => setSelectedSchoolId(value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Schools</SelectItem>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button disabled={selectedSchoolId === "all"}>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add School Admin
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add School Admin</DialogTitle>
                          <DialogDescription>
                            Create a new school administrator
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="school-admin-school">
                              School *
                            </Label>
                            <Select
                              value={newSchoolAdmin.schoolId}
                              onValueChange={(value) =>
                                setNewSchoolAdmin({
                                  ...newSchoolAdmin,
                                  schoolId: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select school" />
                              </SelectTrigger>
                              <SelectContent>
                                {schools.map((school) => (
                                  <SelectItem key={school.id} value={school.id}>
                                    {school.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="school-admin-name">
                              Full Name *
                            </Label>
                            <Input
                              id="school-admin-name"
                              value={newSchoolAdmin.name}
                              onChange={(e) =>
                                setNewSchoolAdmin({
                                  ...newSchoolAdmin,
                                  name: e.target.value,
                                })
                              }
                              placeholder="e.g., Million Abebe"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="school-admin-email">Email *</Label>
                            <Input
                              id="school-admin-email"
                              type="email"
                              value={newSchoolAdmin.email}
                              onChange={(e) =>
                                setNewSchoolAdmin({
                                  ...newSchoolAdmin,
                                  email: e.target.value,
                                })
                              }
                              placeholder="e.g., stmary@school.edu.et"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="school-admin-password">
                              Password *
                            </Label>
                            <Input
                              id="school-admin-password"
                              type="password"
                              value={newSchoolAdmin.password}
                              onChange={(e) =>
                                setNewSchoolAdmin({
                                  ...newSchoolAdmin,
                                  password: e.target.value,
                                })
                              }
                              placeholder="Enter password"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="school-admin-phone">Phone *</Label>
                            <Input
                              id="school-admin-phone"
                              value={newSchoolAdmin.phone}
                              onChange={(e) =>
                                setNewSchoolAdmin({
                                  ...newSchoolAdmin,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="e.g., +251 11 123 4567"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="school-admin-gender">Gender</Label>
                            <Select
                              value={newSchoolAdmin.gender}
                              onValueChange={(value) =>
                                setNewSchoolAdmin({
                                  ...newSchoolAdmin,
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
                          <Button
                            id="add-school-admin-dialog-close"
                            variant="outline"
                            className="hidden"
                          >
                            Close
                          </Button>
                          <Button onClick={handleAddSchoolAdmin}>
                            Add School Admin
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin Name</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        {currentUser?.role === "super_admin" && (
                          <TableHead className="text-right">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schoolAdmins
                        .filter(
                          (admin) =>
                            selectedSchoolId === "all" ||
                            admin.schoolId === selectedSchoolId,
                        )
                        .map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" />
                                {admin.user?.fullname ||
                                  admin.name ||
                                  "Unknown"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <School className="w-4 h-4 text-green-500" />
                                {admin.schoolName || "Unknown School"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">
                                  {admin.user?.email || admin.email}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">
                                  {admin.user?.phone ||
                                    admin.phone ||
                                    "Not provided"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">School Admin</Badge>
                            </TableCell>
                            {currentUser?.role === "super_admin" && (
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleRemoveSchoolAdmin(admin.id)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      {schoolAdmins.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={
                              currentUser?.role === "super_admin" ? 6 : 5
                            }
                            className="text-center py-8"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <User className="w-12 h-12 text-gray-300" />
                              <p className="text-gray-500">
                                No school admins found
                              </p>
                              {currentUser?.role === "super_admin" && (
                                <p className="text-sm text-gray-400">
                                  Add a school admin to manage schools
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Admin Coverage Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Admin Coverage</CardTitle>
                <CardDescription>
                  Schools with and without administrators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {schoolAdmins.length}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total School Admins
                    </div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {new Set(schoolAdmins.map((a) => a.schoolId)).size}
                    </div>
                    <div className="text-sm text-gray-500">
                      Schools with Admins
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      out of {schools.length} total schools
                    </div>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      {Math.max(
                        0,
                        schools.length -
                          new Set(schoolAdmins.map((a) => a.schoolId)).size,
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Schools without Admins
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Need assignment
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          {/* <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>View students in {city.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.fullName || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {student.school?.name || "Unknown"}
                          </TableCell>
                          <TableCell>{student.grade || "N/A"}</TableCell>
                          <TableCell>
                            {student.gpa?.toFixed(2) || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                student.isActive
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              }
                            >
                              {student.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {students.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="w-12 h-12 text-gray-300" />
                              <p className="text-gray-500">No students found</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* Submissions Tab */}
          {/* <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Submissions</CardTitle>
                <CardDescription>
                  View student submissions in {city.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>School</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            {submission.student?.fullName || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {submission.student?.school?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {submission.university?.name || "Unknown"}
                          </TableCell>
                          <TableCell>{submission.program || "N/A"}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                submission.status === "approved"
                                  ? "bg-green-500"
                                  : submission.status === "rejected"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                              }
                            >
                              {submission.status || "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              submission.createdAt,
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {submissions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <BookOpen className="w-12 h-12 text-gray-300" />
                              <p className="text-gray-500">
                                No submissions found
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </main>
    </div>
  );
}
