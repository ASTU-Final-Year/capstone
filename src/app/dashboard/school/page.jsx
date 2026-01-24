"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "recharts";
import {
  Users,
  GraduationCap,
  TrendingUp,
  PlusCircle,
  UserPlus,
  School,
  BookOpen,
  Filter as FilterIcon,
  Edit,
  Send,
  FileText,
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Trash2,
  Search,
  Award,
  ChartBar,
  UserCheck,
  ClipboardCheck,
  BarChart3,
  Building,
  Globe,
  Target,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// API Service functions
const apiService = {
  // Get dashboard overview
  getDashboardOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/school/overview`, {
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Failed to fetch dashboard data");
    }
    return response.json();
  },

  // Get school statistics
  getStatistics: async (academicYear) => {
    const url = `${API_BASE_URL}/school/statistics${academicYear ? `?academicYear=${academicYear}` : ""}`;
    const response = await fetch(url, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch statistics");
    return response.json();
  },

  // Get students with pagination
  getStudents: async (page = 1, limit = 20, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await fetch(`${API_BASE_URL}/school/students?${params}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch students");
    return response.json();
  },

  // Get student details
  getStudentDetails: async (studentId) => {
    const response = await fetch(
      `${API_BASE_URL}/school/students/${studentId}`,
      {
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch student details");
    return response.json();
  },

  // Get school submissions
  getSubmissions: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(
      `${API_BASE_URL}/school/submissions?${params}`,
      {
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch submissions");
    return response.json();
  },

  // Get analytics
  getAnalytics: async (academicYear) => {
    const url = `${API_BASE_URL}/school/analytics${academicYear ? `?academicYear=${academicYear}` : ""}`;
    const response = await fetch(url, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch analytics");
    return response.json();
  },

  // Add new student
  addStudent: async (studentData) => {
    const response = await fetch(`${API_BASE_URL}/school/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(studentData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add student");
    }
    return response.json();
  },

  // Update student
  updateStudent: async (studentId, updates) => {
    const response = await fetch(
      `${API_BASE_URL}/school/students/${studentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      },
    );
    if (!response.ok) throw new Error("Failed to update student");
    return response.json();
  },

  // Submit students to EAES
  submitToEAES: async (studentIds) => {
    const response = await fetch(`${API_BASE_URL}/school/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ studentIds }),
    });
    if (!response.ok) throw new Error("Failed to submit to EAES");
    return response.json();
  },

  // Update school profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/school/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
  },

  // Export student data
  exportStudents: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(
      `${API_BASE_URL}/school/export/students?${params}`,
      {
        credentials: "include",
      },
    );
    if (!response.ok) throw new Error("Failed to export data");
    return response.blob();
  },

  // Check session validity
  checkSession: async () => {
    const response = await fetch(`${API_BASE_URL}/session`, {
      credentials: "include",
    });
    return response.ok;
  },
};

export default function SchoolAdminDashboard() {
  const router = useRouter();

  // State
  const [authLoading, setAuthLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [schoolProfile, setSchoolProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSubmitAllOpen, setIsSubmitAllOpen] = useState(false);
  const [isViewStudentOpen, setIsViewStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [editedProfile, setEditedProfile] = useState({});
  const [newStudent, setNewStudent] = useState({
    student: {
      nationalId: "",
      birthDate: "",
      academicYear: new Date().getFullYear().toString(),
      specialNeed: false,
      gpa: "",
    },
    user: {
      fullname: "",
      email: "",
      gender: "male",
      phone: "",
      password: "",
    },
  });

  // Loading states
  const [loading, setLoading] = useState({
    dashboard: true,
    students: false,
    analytics: false,
    submitting: false,
    exporting: false,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    isActive: true,
    academicYear: "2024",
    hasSubmission: undefined,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // // Check session and redirect if needed
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const hasSession = await apiService.checkSession();
  //     if (!hasSession) {
  //       router.push("/login");
  //       toast({
  //         title: "Session expired",
  //         description: "Please login again",
  //         variant: "destructive",
  //       });
  //     }
  //   };
  //   checkAuth();
  // }, [router, toast]);

  // Check authentication and get school admin data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Starting school admin auth check...");

        // Check session
        const sessionResponse = await api.auth.getCurrentSession();
        console.log("School admin auth check:", sessionResponse);

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
        console.log("School admin authenticated as:", user.role);
        // setCurrentUser(user);

        // Check if user is school_admin or super_admin
        if (!["school_admin", "super_admin"].includes(user.role)) {
          toast.error("Access denied. School admin or super admin required.");
          router.push("/login");
          return;
        }

        // Get admin details to find target school
        console.log("Getting admin details for user:", user.id);
        const adminDetails = await api.admin.getAdminByUserId(user.id);
        console.log("Admin details response:", adminDetails);

        // Super admin can access any school, school admin needs targetId
        let targetSchoolId = null;
        if (user.role === "super_admin") {
          // For super admin, get school from URL params
          const params = new URLSearchParams(window.location.search);
          targetSchoolId = params.get("schoolId") || "demo_school_id";
        } else {
          if (
            !adminDetails ||
            !adminDetails.user ||
            !adminDetails.user.admin ||
            !adminDetails.user.admin.targetId
          ) {
            toast.error("School assignment not found");
            router.push("/login");
            return;
          }
          targetSchoolId = adminDetails.user.admin.targetId;
        }

        console.log("Found target school ID:", targetSchoolId);

        setAuthLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Please login first");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

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

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, dashboard: true }));

      const [dashboardData, submissionsData] = await Promise.all([
        apiService.getDashboardOverview(),
        apiService.getSubmissions({ academicYear: filters.academicYear }),
      ]);

      if (dashboardData.success) {
        const dashboard = dashboardData.dashboard;
        setSchoolProfile(dashboard.school);

        // Transform data for display
        setAnalytics({
          totalStudents: dashboard.totalStudents || 0,
          activeStudents: dashboard.stats?.activeStudents || 0,
          // averageGPA: dashboard.stats?.averageGPA?.toFixed(2) || "0.00",
          specialNeedsCount: dashboard.stats?.specialNeedsCount || 0,
          submissionsCount: dashboard.totalSubmissions || 0,
          yearDistribution:
            dashboard.stats?.byAcademicYear?.map((item) => ({
              year: item.academicYear,
              count: item.studentCount,
            })) || [],
          gpaDistribution: [
            { range: "600", count: Math.floor(Math.random() * 100) + 500 },
            { range: "500", count: Math.floor(Math.random() * 100) + 400 },
            { range: "400", count: Math.floor(Math.random() * 100) + 300 },
            { range: "300", count: Math.floor(Math.random() * 100) + 200 },
            { range: "200", count: Math.floor(Math.random() * 100) + 100 },
          ],
        });

        // Set recent students
        if (dashboard.recentStudents) {
          setStudents(dashboard.recentStudents);
        }
      }

      toast({
        title: "Dashboard updated",
        description: "Latest data fetched successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      });

      if (error.message.includes("Session expired")) {
        router.push("/login");
      }
    } finally {
      setLoading((prev) => ({ ...prev, dashboard: false }));
    }
  }, [filters.academicYear, toast, router]);

  // Load students
  const loadStudents = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, students: true }));

      const response = await apiService
        .getStudents
        // pagination.page,
        // pagination.limit,
        // filters,
        ();

      if (response.success) {
        setStudents(response.students);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("Error loading students:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  }, [pagination.page, pagination.limit, filters, toast]);

  // Load analytics
  const loadAnalytics = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, analytics: true }));

      const response = await apiService.getAnalytics(filters.academicYear);

      if (response.success) {
        setAnalytics(response.analytics);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading((prev) => ({ ...prev, analytics: false }));
    }
  }, [filters.academicYear]);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Load students when tab changes or filters update
  useEffect(() => {
    if (activeTab === "students") {
      loadStudents();
    }
  }, [activeTab, pagination.page, filters, loadStudents]);

  // Load analytics when needed
  useEffect(() => {
    if (activeTab === "overview" || activeTab === "analytics") {
      loadAnalytics();
    }
  }, [activeTab, loadAnalytics]);

  // Handlers
  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
      setLoading((prev) => ({ ...prev, submitting: true }));

      const response = await apiService.addStudent(newStudent);

      if (response.success) {
        toast({
          title: "Success",
          description: "Student added successfully",
        });

        setIsAddStudentOpen(false);
        setNewStudent({
          student: {
            nationalId: "",
            birthDate: "",
            academicYear: new Date().getFullYear().toString(),
            specialNeed: false,
            gpa: "",
          },
          user: {
            fullname: "",
            email: "",
            gender: "male",
            phone: "",
            password: "",
          },
        });

        // Refresh data
        loadDashboardData();
        if (activeTab === "students") {
          loadStudents();
        }
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await apiService.updateProfile(editedProfile);

      if (response.success) {
        setSchoolProfile(editedProfile);
        setIsEditProfileOpen(false);

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleSubmitAllToEAES = async () => {
    try {
      setLoading((prev) => ({ ...prev, submitting: true }));

      const studentIds = students
        .filter((s) => !s.isSubmitted && s.verificationStatus === "verified")
        .map((s) => s.id);

      if (studentIds.length === 0) {
        toast({
          title: "No students to submit",
          description:
            "All eligible students are already submitted or need verification",
          variant: "warning",
        });
        return;
      }

      const response = await apiService.submitToEAES(studentIds);

      if (response.success) {
        toast({
          title: "Success",
          description: `${studentIds.length} students submitted to EAES`,
        });

        setIsSubmitAllOpen(false);
        setSelectedStudents([]);

        // Refresh data
        loadDashboardData();
        loadStudents();
      }
    } catch (error) {
      console.error("Error submitting to EAES:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit to EAES",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleSubmitSelected = async () => {
    try {
      if (selectedStudents.length === 0) return;

      const eligibleStudents = selectedStudents.filter((id) => {
        const student = students.find((s) => s.id === id);
        return (
          student &&
          !student.isSubmitted &&
          student.verificationStatus === "verified"
        );
      });

      if (eligibleStudents.length === 0) {
        toast({
          title: "No eligible students",
          description:
            "Selected students are not verified or already submitted",
          variant: "warning",
        });
        return;
      }

      const response = await apiService.submitToEAES(eligibleStudents);

      if (response.success) {
        toast({
          title: "Success",
          description: `${eligibleStudents.length} students submitted to EAES`,
        });

        setSelectedStudents([]);
        loadDashboardData();
        loadStudents();
      }
    } catch (error) {
      console.error("Error submitting selected:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit students",
        variant: "destructive",
      });
    }
  };

  const handleToggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.id));
    }
  };

  const handleInputChange = (section, field, value) => {
    setNewStudent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleProfileChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewStudent = async (studentId) => {
    try {
      const response = await apiService.getStudentDetails(studentId);
      if (response.success) {
        setSelectedStudent(response.student);
        setIsViewStudentOpen(true);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast({
        title: "Error",
        description: "Failed to load student details",
        variant: "destructive",
      });
    }
  };

  const handleExportData = async () => {
    try {
      setLoading((prev) => ({ ...prev, exporting: true }));

      const blob = await apiService.exportStudents(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `students-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, exporting: false }));
    }
  };

  // Helper functions
  const canSubmitToEAES = students.some(
    (s) => !s.isSubmitted && s.verificationStatus === "verified",
  );

  const verificationProgress = schoolProfile?.stats
    ? Math.round(
        (schoolProfile.stats.verifiedStudents /
          schoolProfile.stats.totalStudents) *
          100,
      ) || 0
    : 0;

  const submissionProgress = schoolProfile?.stats
    ? Math.round(
        (schoolProfile.stats.submissionsCount /
          schoolProfile.stats.totalStudents) *
          100,
      ) || 0
    : 0;

  // Stats cards
  const statsCards = schoolProfile
    ? [
        {
          title: "Total Students",
          value: schoolProfile.stats?.totalStudents || 0,
          icon: Users,
          description: "Registered students",
          color: "bg-blue-500",
        },
        {
          title: "Active Students",
          value: schoolProfile.stats?.activeStudents || 0,
          icon: UserCheck,
          description: "Currently active",
          color: "bg-green-500",
        },
        {
          title: "Average GPA",
          value: schoolProfile.stats?.averageGPA?.toFixed(2) || "0.00",
          icon: TrendingUp,
          description: "School average",
          color: "bg-purple-500",
        },
        {
          title: "EAES Submissions",
          value: schoolProfile.stats?.submissionsCount || 0,
          icon: FileText,
          description: "Submitted to EAES",
          color: "bg-orange-500",
        },
      ]
    : [];

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

  // Loading state
  if (loading.dashboard && !schoolProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Loading School Dashboard
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your data...
          </p>
        </div>
      </div>
    );
  }

  if (!schoolProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Unable to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Please check your connection and try again.
          </p>
          <Button onClick={loadDashboardData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                School Admin Portal
              </h1>
              {loading.dashboard && (
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <School className="h-5 w-5 text-gray-500" />
              <p className="text-gray-600">{schoolProfile.name}</p>
              <Badge variant="secondary">{schoolProfile.type}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>
                <MapPin className="inline h-4 w-4 mr-1" />
                {schoolProfile.city?.name}, {schoolProfile.city?.region?.name}
              </span>
              {schoolProfile.principalName && (
                <span>• Principal: {schoolProfile.principalName}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            {/* <NotificationDropdown /> */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDashboardData()}
            >
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
            {/* <Button
              onClick={() => setIsAddStudentOpen(true)}
              disabled={loading.submitting}
            >
              {loading.submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Add Student
            </Button> */}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BookOpen className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" />
            Students{" "}
            {loading.students && (
              <Loader2 className="ml-2 h-3 w-3 animate-spin" />
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
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
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Verification Progress</CardTitle>
                <CardDescription>
                  Student data verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>
                      Verified: {schoolProfile.stats?.verifiedStudents || 0}{" "}
                      students
                    </span>
                    <span>{verificationProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
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
                    <span>
                      Submitted: {schoolProfile.stats?.submissionsCount || 0}{" "}
                      students
                    </span>
                    <span>{submissionProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${submissionProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Deadline: June 15, 2024
                    </span>
                    {canSubmitToEAES && (
                      <Button
                        size="sm"
                        onClick={() => setIsSubmitAllOpen(true)}
                        className="ml-2"
                        disabled={loading.submitting}
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

          {/* Analytics Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Analytics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">
                      Student Distribution by Year
                    </h4>
                    {analytics.yearDistribution &&
                    analytics.yearDistribution.length > 0 ? (
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.yearDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No distribution data available
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">GPA Distribution</h4>
                    {analytics.gpaDistribution &&
                    analytics.gpaDistribution.length > 0 ? (
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.gpaDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ range, percent }) =>
                                `${range}: ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={70}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {analytics.gpaDistribution.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No GPA data available
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading analytics...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Students</CardTitle>
                  <CardDescription>Recently added students</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDashboardData}
                  disabled={loading.dashboard}
                >
                  {loading.dashboard ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {students.slice(0, 5).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.slice(0, 5).map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.user?.fullname || student.fullname}
                        </TableCell>
                        <TableCell>{student.academicYear}</TableCell>
                        <TableCell>{student.gpa || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={student.isActive ? "default" : "secondary"}
                          >
                            {student.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewStudent(student.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No students found. Add your first student!
                </div>
              )}
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
                    Manage student data for EAES placement
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedStudents.length > 0 && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSubmitSelected}
                      disabled={loading.submitting}
                    >
                      {loading.submitting ? (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-3 w-3" />
                      )}
                      Submit Selected ({selectedStudents.length})
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsSubmitAllOpen(true)}
                    size="sm"
                    disabled={!canSubmitToEAES || loading.submitting}
                  >
                    <FileText className="mr-2 h-3 w-3" />
                    Submit All Verified
                  </Button>
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    size="sm"
                    disabled={loading.exporting}
                  >
                    {loading.exporting ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-3 w-3" />
                    )}
                    Export
                  </Button>
                  <Button
                    onClick={() => setIsAddStudentOpen(true)}
                    size="sm"
                    disabled={loading.submitting}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>
                <Select
                  value={filters.academicYear}
                  onValueChange={(value) =>
                    handleFilterChange("academicYear", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.isActive?.toString() || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "isActive",
                      value === "all" ? undefined : value === "true",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                    <SelectItem value="fullname">Name</SelectItem>
                    <SelectItem value="gpa">GPA</SelectItem>
                    <SelectItem value="academicYear">Academic Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          onChange={handleSelectAll}
                          checked={
                            selectedStudents.length === students.length &&
                            students.length > 0
                          }
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading.students ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                          <p className="text-gray-600">Loading students...</p>
                        </TableCell>
                      </TableRow>
                    ) : students.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Students Found
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {filters.search || filters.academicYear !== "all"
                              ? "No students match your filters"
                              : "Add your first student to get started"}
                          </p>
                          <Button onClick={() => setIsAddStudentOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Student
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() =>
                                handleToggleStudentSelection(student.id)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.user?.fullname || student.fullname}
                          </TableCell>
                          <TableCell>
                            {student.user?.email || student.email}
                          </TableCell>
                          <TableCell>{student.academicYear}</TableCell>
                          <TableCell>{student.gpa || "N/A"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.isActive ? "default" : "secondary"
                              }
                            >
                              {student.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {student.createdAt
                              ? format(
                                  parseISO(student.createdAt),
                                  "MMM dd, yyyy",
                                )
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewStudent(student.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {students.length > 0 && (
                  <div className="flex items-center justify-between border-t px-6 py-4">
                    <div className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total,
                        )}
                      </span>{" "}
                      of <span className="font-medium">{pagination.total}</span>{" "}
                      students
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(1)}
                          disabled={pagination.page === 1 || loading.students}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1 || loading.students}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-sm">
                          Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={
                            pagination.page === pagination.totalPages ||
                            loading.students
                          }
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
                          disabled={
                            pagination.page === pagination.totalPages ||
                            loading.students
                          }
                          className="h-8 w-8 p-0"
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>School Analytics</CardTitle>
              <CardDescription>
                Comprehensive analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.analytics ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading analytics...</p>
                </div>
              ) : analytics ? (
                <div className="space-y-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Students
                            </p>
                            <p className="text-2xl font-bold mt-1">
                              {analytics.totalStudents}
                            </p>
                          </div>
                          <Users className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Active Students
                            </p>
                            <p className="text-2xl font-bold mt-1">
                              {analytics.activeStudents}
                            </p>
                          </div>
                          <UserCheck className="h-8 w-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Average GPA
                            </p>
                            <p className="text-2xl font-bold mt-1">
                              {analytics.averageGPA}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Special Needs
                            </p>
                            <p className="text-2xl font-bold mt-1">
                              {analytics.specialNeedsCount}
                            </p>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Student Distribution by Academic Year
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="h-64">
                        {analytics.yearDistribution &&
                        analytics.yearDistribution.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.yearDistribution}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip />
                              <Bar
                                dataKey="count"
                                fill="#8884d8"
                                name="Student Count"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No distribution data available
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>GPA Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="h-64">
                        {analytics.gpaDistribution &&
                        analytics.gpaDistribution.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics.gpaDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ range, percent }) =>
                                  `${range}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {analytics.gpaDistribution.map((_, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No GPA data available
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No analytics data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
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
                  onClick={() => {
                    setEditedProfile(schoolProfile);
                    setIsEditProfileOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      School Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">School Name</p>
                        <p className="font-medium">{schoolProfile.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">School Type</p>
                        <Badge variant="secondary">{schoolProfile.type}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>
                            {schoolProfile.city?.name},{" "}
                            {schoolProfile.city?.region?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Statistics
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Total Students</p>
                        <p className="font-medium">
                          {schoolProfile.stats?.totalStudents || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Active Students</p>
                        <p className="font-medium">
                          {schoolProfile.stats?.activeStudents || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Average GPA</p>
                        <p className="font-medium">
                          {schoolProfile.stats?.averageGPA?.toFixed(2) ||
                            "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Principal Name</p>
                        <p className="font-medium">
                          {schoolProfile.principalName || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>
                            {schoolProfile.contactEmail || "Not specified"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>
                            {schoolProfile.contactPhone || "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      EAES Timeline
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Submission Deadline
                        </p>
                        <p className="font-medium">June 15, 2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Placement Release
                        </p>
                        <p className="font-medium">August 30, 2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Status</p>
                        <Badge variant="outline" className="bg-blue-50">
                          Active
                        </Badge>
                      </div>
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
                    value={newStudent.user.fullname}
                    onChange={(e) =>
                      handleInputChange("user", "fullname", e.target.value)
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStudent.user.email}
                    onChange={(e) =>
                      handleInputChange("user", "email", e.target.value)
                    }
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
                    value={newStudent.user.phone}
                    onChange={(e) =>
                      handleInputChange("user", "phone", e.target.value)
                    }
                    placeholder="+251911234567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID *</Label>
                  <Input
                    id="nationalId"
                    value={newStudent.student.nationalId}
                    onChange={(e) =>
                      handleInputChange("student", "nationalId", e.target.value)
                    }
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
                    value={newStudent.student.birthDate}
                    onChange={(e) =>
                      handleInputChange("student", "birthDate", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Select
                    value={newStudent.student.academicYear}
                    onValueChange={(value) =>
                      handleInputChange("student", "academicYear", value)
                    }
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
                    value={newStudent.user.gender}
                    onValueChange={(value) =>
                      handleInputChange("user", "gender", value)
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
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="1"
                    min="0"
                    max="600"
                    value={newStudent.student.gpa || ""}
                    onChange={(e) =>
                      handleInputChange("student", "gpa", e.target.value)
                    }
                    placeholder="3.8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newStudent.user.password}
                  onChange={(e) =>
                    handleInputChange("user", "password", e.target.value)
                  }
                  placeholder="Create a temporary password"
                  required
                />
                <p className="text-sm text-gray-500">
                  Student will be prompted to change this on first login
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="specialNeed"
                  checked={newStudent.student.specialNeed}
                  onChange={(e) =>
                    handleInputChange(
                      "student",
                      "specialNeed",
                      e.target.checked,
                    )
                  }
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
                disabled={loading.submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading.submitting}>
                {loading.submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Register Student"
                )}
              </Button>
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
                • Only verified students can be submitted
                <br />
                • Submissions are final and cannot be edited
                <br />• Ensure all student data is correct before submission
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Verified & Ready Students</span>
                <span className="font-bold text-blue-600">
                  {
                    students.filter(
                      (s) =>
                        !s.isSubmitted && s.verificationStatus === "verified",
                    ).length
                  }
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Already Submitted</span>
                <span className="font-bold text-green-600">
                  {students.filter((s) => s.isSubmitted).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Pending Verification</span>
                <span className="font-bold text-yellow-600">
                  {
                    students.filter((s) => s.verificationStatus !== "verified")
                      .length
                  }
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSubmitAllOpen(false)}
              disabled={loading.submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmitAllToEAES}
              disabled={!canSubmitToEAES || loading.submitting}
            >
              {loading.submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit All Verified Students
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Student Dialog */}
      <Dialog open={isViewStudentOpen} onOpenChange={setIsViewStudentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              View student information and records
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="font-medium">
                    {selectedStudent.user?.fullname}
                  </p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedStudent.user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>National ID</Label>
                  <p className="font-medium">{selectedStudent.nationalId}</p>
                </div>
                <div>
                  <Label>Academic Year</Label>
                  <p className="font-medium">{selectedStudent.academicYear}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>GPA</Label>
                  <p className="font-medium">{selectedStudent.gpa || "N/A"}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={selectedStudent.isActive ? "default" : "secondary"}
                  >
                    {selectedStudent.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Special Needs</Label>
                <p className="font-medium">
                  {selectedStudent.specialNeed ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <Label>School</Label>
                <p className="font-medium">{selectedStudent.school?.name}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsViewStudentOpen(false)}
            >
              Close
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
                <Label htmlFor="name">School Name</Label>
                <Input
                  id="name"
                  value={editedProfile.name || ""}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">School Type</Label>
                <Input
                  id="type"
                  value={editedProfile.type || ""}
                  onChange={(e) => handleProfileChange("type", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedProfile.contactPhone || ""}
                    onChange={(e) =>
                      handleProfileChange("contactPhone", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.contactEmail || ""}
                    onChange={(e) =>
                      handleProfileChange("contactEmail", e.target.value)
                    }
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
    </div>
  );
}
