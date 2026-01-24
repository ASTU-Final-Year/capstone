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
  Link,
  Calendar,
  GraduationCap,
  School,
  User,
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

export default function SuperAdminDashboard() {
  const router = useRouter();

  // States
  const [regions, setRegions] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [regionalAdmins, setRegionalAdmins] = useState([]);
  const [universityAdmins, setUniversityAdmins] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedUniversityId, setSelectedUniversityId] = useState(null);

  // Form states
  const [newRegion, setNewRegion] = useState({
    name: "",
    code: "",
  });

  const [newUniversity, setNewUniversity] = useState({
    name: "",
    abbreviation: "",
    regionId: "",
    longitude: 0,
    latitude: 0,
    capacity: 1000,
    website: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [newRegionalAdmin, setNewRegionalAdmin] = useState({
    regionId: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "male",
  });

  const [newUniversityAdmin, setNewUniversityAdmin] = useState({
    universityId: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: "male",
  });

  const [newPlacement, setNewPlacement] = useState({
    name: "",
    academicYear: "2024",
  });

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get the current session
        const response = await api.auth.getCurrentSession();
        console.log("Auth check response:", response);

        // Check if we have a valid session
        if (response.success && response.session) {
          console.log("Session found:", response.session);

          // Now get the user information
          //   const userResponse = await api.auth.getCurrentUser();
          const user = response.session.user;
          console.log("User response:", user);

          if (user) {
            console.log("Authenticated as:", user.role);

            // Check if user is super_admin
            if (user.role !== "super_admin") {
              toast.error("Access denied. Super admin required.");
              router.push("/login");
            }

            setAuthLoading(false);
            loadData();
          } else {
            toast.error("Please login first");
            router.push("/login");
          }
        } else {
          toast.error("Please login first");
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Please login first");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true);

      // Load system stats
      const statsRes = await api.superAdmin.getSystemStats();
      setSystemStats(statsRes.stats);

      // Load regions
      const regionsRes = await api.superAdmin.getRegions();
      setRegions(regionsRes.regions || []);

      // Load universities
      const universitiesRes = await api.superAdmin.getUniversities();
      setUniversities(universitiesRes.universities || []);

      // Load regional admins
      const regionalAdminsRes =
        await api.superAdmin.getAdminsByRole("region_admin");
      setRegionalAdmins(
        (regionalAdminsRes.admins || []).map((admin) => ({
          ...admin,
          regionName: admin.target?.name || "Unknown Region",
        })),
      );

      // Load university admins
      const universityAdminsRes =
        await api.superAdmin.getAdminsByRole("university_admin");
      setUniversityAdmins(
        (universityAdminsRes.admins || []).map((admin) => ({
          ...admin,
          universityName: admin.target?.name || "Unknown University",
        })),
      );

      // Load placements (mock data for now - you'll need to implement backend)
      // For now, using empty array
      setPlacements([]);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);

      // If unauthorized, redirect to login
      if (error.message.includes("401") || error.message.includes("403")) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
  const handleAddRegion = async () => {
    if (!newRegion.name) {
      toast.error("Region name is required");
      return;
    }

    try {
      const response = await api.superAdmin.createRegion(newRegion);
      if (response.success) {
        toast.success("Region added successfully");
        setRegions([...regions, response.region]);
        setNewRegion({ name: "", code: "" });
        // Close dialog
        document
          .querySelector('[data-state="open"]')
          ?.querySelector("[data-dialog-close]")
          ?.click();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add region");
    }
  };

  const handleAddUniversity = async () => {
    if (
      !newUniversity.name ||
      !newUniversity.abbreviation ||
      !newUniversity.regionId ||
      !newUniversity.capacity
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await api.superAdmin.createUniversity(newUniversity);
      if (response.success) {
        toast.success("University added successfully");
        setUniversities([...universities, response.university]);
        setNewUniversity({
          name: "",
          abbreviation: "",
          regionId: "",
          longitude: 0,
          latitude: 0,
          capacity: 1000,
          website: "",
          contactEmail: "",
          contactPhone: "",
        });
        // Close dialog
        document
          .querySelector('[data-state="open"]')
          ?.querySelector("[data-dialog-close]")
          ?.click();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add university");
    }
  };

  const handleAddRegionalAdmin = async () => {
    if (
      !newRegionalAdmin.regionId ||
      !newRegionalAdmin.name ||
      !newRegionalAdmin.email ||
      !newRegionalAdmin.password
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await api.superAdmin.createAdmin({
        role: "region_admin",
        targetId: newRegionalAdmin.regionId,
        fullname: newRegionalAdmin.name,
        email: newRegionalAdmin.email,
        password: newRegionalAdmin.password,
        gender: newRegionalAdmin.gender,
        phone: newRegionalAdmin.phone,
      });

      if (response.success) {
        toast.success("Regional admin added successfully");
        setRegionalAdmins([
          ...regionalAdmins,
          {
            ...response.admin,
            user: response.user,
            regionName:
              regions.find((r) => r.id === newRegionalAdmin.regionId)?.name ||
              "Unknown Region",
          },
        ]);
        setNewRegionalAdmin({
          regionId: "",
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
      toast.error(error.message || "Failed to add regional admin");
    }
  };

  const handleAddUniversityAdmin = async () => {
    if (
      !newUniversityAdmin.universityId ||
      !newUniversityAdmin.name ||
      !newUniversityAdmin.email ||
      !newUniversityAdmin.password
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await api.superAdmin.createAdmin({
        role: "university_admin",
        targetId: newUniversityAdmin.universityId,
        fullname: newUniversityAdmin.name,
        email: newUniversityAdmin.email,
        password: newUniversityAdmin.password,
        gender: newUniversityAdmin.gender,
        phone: newUniversityAdmin.phone,
      });

      if (response.success) {
        toast.success("University admin added successfully");
        setUniversityAdmins([
          ...universityAdmins,
          {
            ...response.admin,
            user: response.user,
            universityName:
              universities.find((u) => u.id === newUniversityAdmin.universityId)
                ?.name || "Unknown University",
          },
        ]);
        setNewUniversityAdmin({
          universityId: "",
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
      toast.error(error.message || "Failed to add university admin");
    }
  };

  const handleDeleteRegion = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this region? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await api.superAdmin.deleteRegion(id);
      if (response.success) {
        toast.success("Region deleted successfully");
        setRegions(regions.filter((region) => region.id !== id));
        // Also remove any admins associated with this region
        setRegionalAdmins(
          regionalAdmins.filter((admin) => admin.targetId !== id),
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete region");
    }
  };

  const handleDeleteUniversity = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this university? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await api.superAdmin.deleteUniversity(id);
      if (response.success) {
        toast.success("University deleted successfully");
        setUniversities(universities.filter((uni) => uni.id !== id));
        // Also remove any admins associated with this university
        setUniversityAdmins(
          universityAdmins.filter((admin) => admin.targetId !== id),
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete university");
    }
  };

  const handleDeleteRegionalAdmin = async (id, userId) => {
    if (!confirm("Are you sure you want to remove this admin?")) {
      return;
    }

    try {
      const response = await api.superAdmin.demoteAdmin(id, userId);
      if (response.success) {
        toast.success("Regional admin removed successfully");
        setRegionalAdmins(regionalAdmins.filter((admin) => admin.id !== id));
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove admin");
    }
  };

  const handleDeleteUniversityAdmin = async (id, userId) => {
    if (!confirm("Are you sure you want to remove this admin?")) {
      return;
    }

    try {
      const response = await api.superAdmin.demoteAdmin(id, userId);
      if (response.success) {
        toast.success("University admin removed successfully");
        setUniversityAdmins(
          universityAdmins.filter((admin) => admin.id !== id),
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove admin");
    }
  };

  // Placement handlers (mock for now)
  const handleInitiatePlacement = () => {
    if (!newPlacement.name) {
      toast.error("Please enter placement name");
      return;
    }

    const newPlacementObj = {
      id: `place_${String(placements.length + 1).padStart(3, "0")}`,
      name: newPlacement.name,
      academicYear: newPlacement.academicYear,
      status: "not_started",
      startedAt: null,
      completedAt: null,
    };

    setPlacements([...placements, newPlacementObj]);
    toast.success("Placement initiated successfully");
    setNewPlacement({ name: "", academicYear: "2024" });

    // Close dialog
    document
      .querySelector('[data-state="open"]')
      ?.querySelector("[data-dialog-close]")
      ?.click();
  };

  const handleStartPlacement = (id) => {
    setPlacements(
      placements.map((placement) =>
        placement.id === id
          ? {
              ...placement,
              status: "started",
              startedAt: new Date().toISOString().split("T")[0],
            }
          : placement,
      ),
    );
    toast.success("Placement started successfully");
  };

  const handleCompletePlacement = (id) => {
    setPlacements(
      placements.map((placement) =>
        placement.id === id
          ? {
              ...placement,
              status: "done",
              completedAt: new Date().toISOString().split("T")[0],
            }
          : placement,
      ),
    );
    toast.success("Placement marked as completed");
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

  const navigateToRegionalAdmins = (regionId) => {
    setSelectedRegionId(regionId);
    const tabs = document.querySelector('[data-state="active"]');
    if (tabs) {
      const regionalAdminsTab = document.querySelector(
        '[value="regional-admins"]',
      );
      if (regionalAdminsTab) {
        regionalAdminsTab.click();
      }
    }
  };

  const navigateToUniversityAdmins = (universityId) => {
    setSelectedUniversityId(universityId);
    const tabs = document.querySelector('[data-state="active"]');
    if (tabs) {
      const universityAdminsTab = document.querySelector(
        '[value="university-admins"]',
      );
      if (universityAdminsTab) {
        universityAdminsTab.click();
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading Super Admin Dashboard...</p>
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ChoiceX Super Admin
                </h1>
                <p className="text-sm text-gray-500">System Administration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">System Status</p>
                <p className="text-xs text-green-600">● Online</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
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
            <TabsTrigger value="university-admins">
              University Admins
            </TabsTrigger>
            <TabsTrigger value="placements">Placements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {systemStats && (
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-3xl font-bold">
                        {systemStats.totalRegions || regions.length}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Total Regions
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold">
                        {systemStats.totalUniversities || universities.length}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Total Universities
                      </p>
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
                        {systemStats.totalAdmins ||
                          regionalAdmins.length + universityAdmins.length}
                      </p>
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
                      <p className="text-3xl font-bold">
                        {systemStats.totalSubmissions || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Total Submissions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Regions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {regions.slice(0, 3).map((region) => (
                      <div
                        key={region.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{region.name}</p>
                          <p className="text-sm text-gray-500">
                            Code: {region.code}
                          </p>
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
                    {universities.slice(0, 3).map((uni) => (
                      <div
                        key={uni.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{uni.name}</p>
                          <p className="text-sm text-gray-500">
                            {uni.abbreviation}
                          </p>
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
                        <DialogDescription>
                          Register a new region in the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="region-name">Region Name *</Label>
                          <Input
                            id="region-name"
                            value={newRegion.name}
                            onChange={(e) =>
                              setNewRegion({
                                ...newRegion,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., Somali"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="region-code">Short Code</Label>
                          <Input
                            id="region-code"
                            value={newRegion.code}
                            onChange={(e) =>
                              setNewRegion({
                                ...newRegion,
                                code: e.target.value,
                              })
                            }
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
                      {regions.map((region) => (
                        <TableRow key={region.id}>
                          <TableCell className="font-mono text-sm">
                            {region.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="font-medium">
                            {region.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{region.code}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(region.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  navigateToRegionalAdmins(region.id)
                                }
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
                      {selectedRegionId
                        ? `Admins for selected region`
                        : "Manage regional administrators"}
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Regional Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Regional Admin</DialogTitle>
                        <DialogDescription>
                          Assign an admin to a region
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="admin-region">Region *</Label>
                          <Select
                            value={newRegionalAdmin.regionId}
                            onValueChange={(value) =>
                              setNewRegionalAdmin({
                                ...newRegionalAdmin,
                                regionId: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region) => (
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
                            onChange={(e) =>
                              setNewRegionalAdmin({
                                ...newRegionalAdmin,
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
                            value={newRegionalAdmin.email}
                            onChange={(e) =>
                              setNewRegionalAdmin({
                                ...newRegionalAdmin,
                                email: e.target.value,
                              })
                            }
                            placeholder="e.g., admin@region.gov.et"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-password">
                            Admin Password *
                          </Label>
                          <Input
                            id="admin-password"
                            type="password"
                            value={newRegionalAdmin.password}
                            onChange={(e) =>
                              setNewRegionalAdmin({
                                ...newRegionalAdmin,
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
                            value={newRegionalAdmin.phone}
                            onChange={(e) =>
                              setNewRegionalAdmin({
                                ...newRegionalAdmin,
                                phone: e.target.value,
                              })
                            }
                            placeholder="e.g., +251 11 123 4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-gender">Gender</Label>
                          <Select
                            value={newRegionalAdmin.gender}
                            onValueChange={(value) =>
                              setNewRegionalAdmin({
                                ...newRegionalAdmin,
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
                        <Button onClick={handleAddRegionalAdmin}>
                          Add Admin
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
                        <TableHead>Admin Name</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionalAdmins
                        .filter(
                          (admin) =>
                            !selectedRegionId ||
                            admin.targetId === selectedRegionId,
                        )
                        .map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell className="font-medium">
                              {admin.user?.fullname}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <span>{admin.regionName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{admin.user?.email}</TableCell>
                            <TableCell>{admin.user?.phone}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteRegionalAdmin(
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
                    <CardDescription>
                      Manage system universities
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add University
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New University</DialogTitle>
                        <DialogDescription>
                          Register a new university in the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="uni-name">University Name *</Label>
                            <Input
                              id="uni-name"
                              value={newUniversity.name}
                              onChange={(e) =>
                                setNewUniversity({
                                  ...newUniversity,
                                  name: e.target.value,
                                })
                              }
                              placeholder="e.g., Haramaya University"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="uni-abbr">Abbreviation *</Label>
                            <Input
                              id="uni-abbr"
                              value={newUniversity.abbreviation}
                              onChange={(e) =>
                                setNewUniversity({
                                  ...newUniversity,
                                  abbreviation: e.target.value,
                                })
                              }
                              placeholder="e.g., HU"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uni-region">Region *</Label>
                          <Select
                            value={newUniversity.regionId}
                            onValueChange={(value) =>
                              setNewUniversity({
                                ...newUniversity,
                                regionId: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region) => (
                                <SelectItem key={region.id} value={region.id}>
                                  {region.name} ({region.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="uni-longitude">Longitude</Label>
                            <Input
                              id="uni-longitude"
                              type="number"
                              step="0.000001"
                              value={newUniversity.longitude}
                              onChange={(e) =>
                                setNewUniversity({
                                  ...newUniversity,
                                  longitude: parseFloat(e.target.value) || 0,
                                })
                              }
                              placeholder="e.g., 9.005401"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="uni-latitude">Latitude</Label>
                            <Input
                              id="uni-latitude"
                              type="number"
                              step="0.000001"
                              value={newUniversity.latitude}
                              onChange={(e) =>
                                setNewUniversity({
                                  ...newUniversity,
                                  latitude: parseFloat(e.target.value) || 0,
                                })
                              }
                              placeholder="e.g., 38.763611"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uni-capacity">Capacity *</Label>
                          <Input
                            id="uni-capacity"
                            type="number"
                            value={newUniversity.capacity}
                            onChange={(e) =>
                              setNewUniversity({
                                ...newUniversity,
                                capacity: parseInt(e.target.value) || 1000,
                              })
                            }
                            placeholder="e.g., 5000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uni-website">Website</Label>
                          <Input
                            id="uni-website"
                            value={newUniversity.website}
                            onChange={(e) =>
                              setNewUniversity({
                                ...newUniversity,
                                website: e.target.value,
                              })
                            }
                            placeholder="e.g., https://www.university.edu.et"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="uni-email">Contact Email</Label>
                            <Input
                              id="uni-email"
                              type="email"
                              value={newUniversity.contactEmail}
                              onChange={(e) =>
                                setNewUniversity({
                                  ...newUniversity,
                                  contactEmail: e.target.value,
                                })
                              }
                              placeholder="e.g., info@university.edu.et"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="uni-phone">Contact Phone</Label>
                            <Input
                              id="uni-phone"
                              value={newUniversity.contactPhone}
                              onChange={(e) =>
                                setNewUniversity({
                                  ...newUniversity,
                                  contactPhone: e.target.value,
                                })
                              }
                              placeholder="e.g., +251 11 123 4567"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddUniversity}>
                          Add University
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
                        <TableHead>University Name</TableHead>
                        <TableHead>Abbreviation</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {universities.map((uni) => (
                        <TableRow key={uni.id}>
                          <TableCell className="font-medium">
                            {uni.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{uni.abbreviation}</Badge>
                          </TableCell>
                          <TableCell>
                            {regions.find((r) => r.id === uni.regionId)?.name ||
                              "Unknown"}
                          </TableCell>
                          <TableCell>{uni.capacity}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                uni.isActive ? "bg-green-500" : "bg-gray-500"
                              }
                            >
                              {uni.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  navigateToUniversityAdmins(uni.id)
                                }
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
                      {selectedUniversityId
                        ? `Admins for selected university`
                        : "Manage university administrators"}
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add University Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add University Admin</DialogTitle>
                        <DialogDescription>
                          Assign an admin to a university
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="uni-admin-university">
                            University *
                          </Label>
                          <Select
                            value={newUniversityAdmin.universityId}
                            onValueChange={(value) =>
                              setNewUniversityAdmin({
                                ...newUniversityAdmin,
                                universityId: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select university" />
                            </SelectTrigger>
                            <SelectContent>
                              {universities.map((uni) => (
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
                            onChange={(e) =>
                              setNewUniversityAdmin({
                                ...newUniversityAdmin,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., Dr. Samuel"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uni-admin-email">Admin Email *</Label>
                          <Input
                            id="uni-admin-email"
                            type="email"
                            value={newUniversityAdmin.email}
                            onChange={(e) =>
                              setNewUniversityAdmin({
                                ...newUniversityAdmin,
                                email: e.target.value,
                              })
                            }
                            placeholder="e.g., admin@university.edu.et"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uni-admin-password">
                            Admin Password *
                          </Label>
                          <Input
                            id="uni-admin-password"
                            type="password"
                            value={newUniversityAdmin.password}
                            onChange={(e) =>
                              setNewUniversityAdmin({
                                ...newUniversityAdmin,
                                password: e.target.value,
                              })
                            }
                            placeholder="Create a password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uni-admin-phone">Admin Phone</Label>
                          <Input
                            id="uni-admin-phone"
                            value={newUniversityAdmin.phone}
                            onChange={(e) =>
                              setNewUniversityAdmin({
                                ...newUniversityAdmin,
                                phone: e.target.value,
                              })
                            }
                            placeholder="e.g., +251 11 123 4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="uni-admin-gender">Gender</Label>
                          <Select
                            value={newUniversityAdmin.gender}
                            onValueChange={(value) =>
                              setNewUniversityAdmin({
                                ...newUniversityAdmin,
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
                        <Button onClick={handleAddUniversityAdmin}>
                          Add Admin
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
                        <TableHead>Admin Name</TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {universityAdmins
                        .filter(
                          (admin) =>
                            !selectedUniversityId ||
                            admin.targetId === selectedUniversityId,
                        )
                        .map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell className="font-medium">
                              {admin.user?.fullname}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-purple-500" />
                                <span>{admin.universityName}</span>
                              </div>
                            </TableCell>
                            <TableCell>{admin.user?.email}</TableCell>
                            <TableCell>{admin.user?.phone}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteUniversityAdmin(
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
                    <CardDescription>
                      Initiate and manage placement processes
                    </CardDescription>
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
                        <DialogDescription>
                          Start a new placement process
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="placement-name">
                            Placement Name *
                          </Label>
                          <Input
                            id="placement-name"
                            value={newPlacement.name}
                            onChange={(e) =>
                              setNewPlacement({
                                ...newPlacement,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., 2024 University Placement"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="placement-year">Academic Year</Label>
                          <Select
                            value={newPlacement.academicYear}
                            onValueChange={(value) =>
                              setNewPlacement({
                                ...newPlacement,
                                academicYear: value,
                              })
                            }
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
                        <Button onClick={handleInitiatePlacement}>
                          Create Placement
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
                        <TableHead>Placement Name</TableHead>
                        <TableHead>Academic Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {placements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center">
                              <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                              <p className="text-gray-500">
                                No placements created yet
                              </p>
                              <p className="text-sm text-gray-400 mt-2">
                                Use the "Initiate Placement" button to create
                                your first placement
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        placements.map((placement) => (
                          <TableRow key={placement.id}>
                            <TableCell className="font-medium">
                              {placement.name}
                            </TableCell>
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
                            <TableCell>
                              {placement.completedAt || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {placement.status === "not_started" && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleStartPlacement(placement.id)
                                    }
                                  >
                                    Start
                                  </Button>
                                )}
                                {placement.status === "started" && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() =>
                                      handleCompletePlacement(placement.id)
                                    }
                                  >
                                    Mark Done
                                  </Button>
                                )}
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
        </Tabs>
      </main>
    </div>
  );
}
