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
  Edit,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  User,
  School as SchoolIcon,
  MapPin,
  Award,
  TrendingUp,
  AlertCircle,
  ArrowUpDown,
  GripVertical,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Save,
  RotateCcw,
  Check,
  X,
  Trophy,
  Target
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';

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
    verificationStatus: "verified",
    placementStatus: "pending"
  })

  const [submission, setSubmission] = useState(null)
  const [placement, setPlacement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterField, setFilterField] = useState("all")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [originalOrder, setOriginalOrder] = useState([])

  // Complete list of Ethiopian universities
  const allEthiopianUniversities = [
    { id: "uni_001", name: "Addis Ababa University", abbreviation: "AAU", location: "Addis Ababa", type: "Public", established: 1950, students: "45,000+", programs: ["Medicine", "Engineering", "Law", "Business", "Science", "Arts"] },
    { id: "uni_002", name: "Bahir Dar University", abbreviation: "BDU", location: "Bahir Dar", type: "Public", established: 1963, students: "35,000+", programs: ["Engineering", "Agriculture", "Education", "Health Sciences", "Business"] },
    { id: "uni_003", name: "Jimma University", abbreviation: "JU", location: "Jimma", type: "Public", established: 1999, students: "32,000+", programs: ["Medicine", "Agriculture", "Social Sciences", "Technology", "Health"] },
    { id: "uni_004", name: "Hawassa University", abbreviation: "HU", location: "Hawassa", type: "Public", established: 2000, students: "30,000+", programs: ["Medicine", "Agriculture", "Business", "Education", "Technology"] },
    { id: "uni_005", name: "Mekelle University", abbreviation: "MU", location: "Mekelle", type: "Public", established: 1993, students: "28,000+", programs: ["Engineering", "Health Sciences", "Business", "Law", "Agriculture"] },
    { id: "uni_006", name: "University of Gondar", abbreviation: "UoG", location: "Gondar", type: "Public", established: 1954, students: "25,000+", programs: ["Medicine", "Health Sciences", "Business", "Social Sciences", "Education"] },
    { id: "uni_007", name: "Arba Minch University", abbreviation: "AMU", location: "Arba Minch", type: "Public", established: 1986, students: "22,000+", programs: ["Technology", "Water Resources", "Tourism", "Agriculture", "Business"] },
    { id: "uni_008", name: "Debre Markos University", abbreviation: "DMU", location: "Debre Markos", type: "Public", established: 2007, students: "20,000+", programs: ["Education", "Health", "Business", "Technology", "Agriculture"] },
    { id: "uni_009", name: "Wollega University", abbreviation: "WU", location: "Nekemte", type: "Public", established: 2007, students: "18,000+", programs: ["Agriculture", "Education", "Health", "Technology", "Business"] },
    { id: "uni_010", name: "Adama Science and Technology University", abbreviation: "ASTU", location: "Adama", type: "Public", established: 1993, students: "15,000+", programs: ["Technology", "Engineering", "Computing", "Business", "Science"] },
    { id: "uni_011", name: "Dilla University", abbreviation: "DU", location: "Dilla", type: "Public", established: 1996, students: "16,000+", programs: ["Agriculture", "Education", "Health", "Business", "Technology"] },
    { id: "uni_012", name: "Mizan-Tepi University", abbreviation: "MTU", location: "Mizan Teferi", type: "Public", established: 2007, students: "12,000+", programs: ["Agriculture", "Health", "Business", "Education", "Technology"] },
    { id: "uni_013", name: "Woldia University", abbreviation: "WDU", location: "Woldia", type: "Public", established: 2011, students: "10,000+", programs: ["Education", "Health", "Business", "Technology", "Agriculture"] },
    { id: "uni_014", name: "Assosa University", abbreviation: "ASU", location: "Assosa", type: "Public", established: 2011, students: "8,000+", programs: ["Education", "Health", "Business", "Agriculture", "Social Sciences"] },
    { id: "uni_015", name: "Dire Dawa University", abbreviation: "DDU", location: "Dire Dawa", type: "Public", established: 2006, students: "9,000+", programs: ["Technology", "Business", "Health", "Education", "Social Sciences"] },
  ]

  // Initialize with all universities in alphabetical order
  const [universityPreferences, setUniversityPreferences] = useState(
    allEthiopianUniversities.map((uni, index) => ({
      ...uni,
      rank: index + 1,
      isFavorite: index < 3 // First 3 as favorites by default
    }))
  )

  useEffect(() => {
    const fetchData = async () => {
      // Mock API calls - load saved preferences if they exist
      setTimeout(() => {
        // Check if there are saved preferences in localStorage
        const savedPreferences = localStorage.getItem(`student_${student.id}_preferences`)

        if (savedPreferences) {
          const parsedPreferences = JSON.parse(savedPreferences)
          setUniversityPreferences(parsedPreferences)
          setOriginalOrder([...parsedPreferences])
        } else {
          // Default alphabetical order
          const defaultOrder = [...allEthiopianUniversities]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((uni, index) => ({
              ...uni,
              rank: index + 1,
              isFavorite: index < 3
            }))

          setUniversityPreferences(defaultOrder)
          setOriginalOrder([...defaultOrder])
        }

        setSubmission({
          id: "sub_001",
          studentId: "stu_001",
          academicYear: "2024",
          status: "draft",
          submittedAt: null,
          updatedAt: new Date().toISOString()
        })

        setPlacement({
          id: "place_001",
          studentId: "stu_001",
          universityId: null,
          universityName: null,
          program: null,
          status: "pending",
          placementDate: "2024-06-15",
          submittedAt: null,
          createdAt: "2024-01-20T09:15:00Z"
        })

        setLoading(false)
      }, 1000)
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    // Clear session and redirect
    router.push("/login")
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(universityPreferences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update ranks based on new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    setUniversityPreferences(updatedItems);
    setHasUnsavedChanges(true);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;

    const items = [...universityPreferences];
    [items[index], items[index - 1]] = [items[index - 1], items[index]];

    const updatedItems = items.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    setUniversityPreferences(updatedItems);
    setHasUnsavedChanges(true);
  };

  const handleMoveDown = (index) => {
    if (index === universityPreferences.length - 1) return;

    const items = [...universityPreferences];
    [items[index], items[index + 1]] = [items[index + 1], items[index]];

    const updatedItems = items.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    setUniversityPreferences(updatedItems);
    setHasUnsavedChanges(true);
  };

  const handleMoveToTop = (index) => {
    const items = [...universityPreferences];
    const [movedItem] = items.splice(index, 1);
    items.unshift(movedItem);

    const updatedItems = items.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    setUniversityPreferences(updatedItems);
    setHasUnsavedChanges(true);
  };

  const handleMoveToBottom = (index) => {
    const items = [...universityPreferences];
    const [movedItem] = items.splice(index, 1);
    items.push(movedItem);

    const updatedItems = items.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    setUniversityPreferences(updatedItems);
    setHasUnsavedChanges(true);
  };

  const handleToggleFavorite = (id) => {
    const updatedPreferences = universityPreferences.map(uni =>
      uni.id === id ? { ...uni, isFavorite: !uni.isFavorite } : uni
    );

    setUniversityPreferences(updatedPreferences);
    setHasUnsavedChanges(true);
  };

  const handleSavePreferences = () => {
    // Save to localStorage
    localStorage.setItem(`student_${student.id}_preferences`, JSON.stringify(universityPreferences));

    // Save original order for reset
    setOriginalOrder([...universityPreferences]);
    setHasUnsavedChanges(false);

    alert("University preferences saved successfully!");
  };

  const handleResetToDefault = () => {
    const defaultOrder = [...allEthiopianUniversities]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((uni, index) => ({
        ...uni,
        rank: index + 1,
        isFavorite: index < 3
      }));

    setUniversityPreferences(defaultOrder);
    setHasUnsavedChanges(true);
  };

  const handleSubmitPreferences = () => {
    if (!student.verificationStatus === "verified") {
      alert("Please verify your data first before submitting preferences.");
      return;
    }

    // API call to submit preferences
    const submissionData = {
      ...submission,
      status: "submitted",
      universityPreferences: universityPreferences,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSubmission(submissionData);

    // Clear unsaved changes
    setHasUnsavedChanges(false);

    alert("University preferences submitted successfully to EAES!");
  };

  const handleVerifyData = () => {
    // API call to verify student data
    setStudent(prev => ({ ...prev, verificationStatus: "verified" }));
    alert("Your data has been verified!");
  };

  // Filtered universities based on search
  const filteredUniversities = universityPreferences.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "GPA", value: student.gpa, icon: Award, color: "text-green-500" },
    { label: "Verification Status", value: student.verificationStatus === "verified" ? "Verified" : "Pending", icon: CheckCircle, color: student.verificationStatus === "verified" ? "text-green-500" : "text-amber-500" },
    { label: "Total Universities", value: universityPreferences.length, icon: SchoolIcon, color: "text-blue-500" },
    { label: "Submission Status", value: submission?.status === "submitted" ? "Submitted" : "Draft", icon: FileText, color: submission?.status === "submitted" ? "text-green-500" : "text-amber-500" }
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
              <span className="text-xl font-bold text-foreground">EAES Student Portal</span>
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
          <h1 className="text-3xl font-bold text-foreground">Welcome, {student.fullname}!</h1>
          <p className="text-muted-foreground mt-2">
            This is your EAES portal. Sort ALL Ethiopian universities according to your preference for placement.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-muted-foreground">
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

        {/* Important Notice */}
        {student.verificationStatus !== "verified" && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Action Required: Verify Your Data</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    Please verify your personal and academic information before submitting university preferences.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 bg-yellow-600 hover:bg-yellow-700"
                    onClick={handleVerifyData}
                  >
                    Verify My Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 bg-card border rounded-lg">
          <div>
            <h3 className="font-semibold">University Preference Ranking</h3>
            <p className="text-sm text-muted-foreground">
              Sort all {universityPreferences.length} Ethiopian universities by dragging or using arrows
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handleResetToDefault}
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button
              variant="outline"
              onClick={handleSavePreferences}
              size="sm"
              disabled={!hasUnsavedChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={handleSubmitPreferences}
              size="sm"
              disabled={student.verificationStatus !== "verified"}
            >
              <FileText className="w-4 h-4 mr-2" />
              Submit to EAES
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="ranking" className="space-y-8">
          <TabsList>
            <TabsTrigger value="ranking">Rank Universities</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="placement">Placement Status</TabsTrigger>
          </TabsList>

          <TabsContent value="ranking" className="space-y-8">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search universities by name, abbreviation, or location..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterField} onValueChange={setFilterField}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Universities</SelectItem>
                      <SelectItem value="favorites">Favorites Only</SelectItem>
                      <SelectItem value="public">Public Only</SelectItem>
                      <SelectItem value="major">Major Cities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>Your top 3 choices will be marked as favorites and receive priority consideration</span>
                </div>
              </CardContent>
            </Card>

            {/* University Ranking Table */}
            <Card>
              <CardHeader>
                <CardTitle>University Preference Ranking</CardTitle>
                <CardDescription>
                  Drag to reorder or use the arrow buttons. Rank 1 is your highest preference.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredUniversities.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No universities found</h3>
                    <p className="text-muted-foreground">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="university-ranking">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                          >
                            {filteredUniversities.map((uni, index) => (
                              <Draggable key={uni.id} draggableId={uni.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-accent transition-colors ${uni.isFavorite ? 'border-yellow-200 bg-yellow-50' : ''}`}
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing"
                                    >
                                      <GripVertical className="w-5 h-5 text-muted-foreground" />
                                    </div>

                                    <div className="flex items-center justify-between flex-1">
                                      <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${uni.rank <= 3 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-primary/10'}`}>
                                          <span className={`font-bold ${uni.rank <= 3 ? 'text-yellow-700' : 'text-primary'}`}>
                                            {uni.rank}
                                          </span>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-semibold">{uni.name}</h4>
                                            {uni.isFavorite && (
                                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                                <Trophy className="w-3 h-3 mr-1" />
                                                Top Choice
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                            <Badge variant="secondary">{uni.abbreviation}</Badge>
                                            <span>{uni.location}</span>
                                            <span>•</span>
                                            <span>{uni.type}</span>
                                            <span>•</span>
                                            <span>Est. {uni.established}</span>
                                          </div>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {uni.programs.slice(0, 2).map((program, idx) => (
                                              <Badge key={idx} variant="outline" className="text-xs">
                                                {program}
                                              </Badge>
                                            ))}
                                            {uni.programs.length > 2 && (
                                              <span className="text-xs text-muted-foreground">
                                                +{uni.programs.length - 2} more
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <div className="flex flex-col gap-1">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleMoveToTop(index)}
                                            title="Move to top"
                                          >
                                            <ChevronUp className="h-3 w-3" />
                                            <span className="sr-only text-xs">Top</span>
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleMoveUp(index)}
                                            disabled={index === 0}
                                            title="Move up"
                                          >
                                            <ChevronUp className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleMoveDown(index)}
                                            disabled={index === filteredUniversities.length - 1}
                                            title="Move down"
                                          >
                                            <ChevronDown className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleMoveToBottom(index)}
                                            title="Move to bottom"
                                          >
                                            <ChevronDown className="h-3 w-3" />
                                            <span className="sr-only text-xs">Bottom</span>
                                          </Button>
                                        </div>

                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleToggleFavorite(uni.id)}
                                          className={uni.isFavorite ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" : "text-gray-400 hover:text-gray-600"}
                                          title={uni.isFavorite ? "Remove from favorites" : "Mark as favorite"}
                                        >
                                          {uni.isFavorite ? (
                                            <Check className="h-5 w-5" />
                                          ) : (
                                            <Plus className="h-5 w-5" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    {/* Ranking Legend */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800">How University Ranking Works</h4>
                          <ul className="text-sm text-blue-700 space-y-1 mt-2">
                            <li>• <strong>Rank 1-3</strong> (Yellow): Your top priority choices - EAES will try to place you here first</li>
                            <li>• <strong>Rank 4-10</strong>: High preference choices</li>
                            <li>• <strong>Rank 11-15</strong>: Lower preference choices</li>
                            <li>• You must rank ALL available universities</li>
                            <li>• EAES will use this ranking to determine your placement</li>
                            <li>• All placements are released simultaneously on June 15, 2024</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Profile</CardTitle>
                    <CardDescription>Your personal information and academic details</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
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
                      <Label>Verification Status</Label>
                      <div className="flex items-center gap-2">
                        <Input value={student.verificationStatus} readOnly />
                        <Badge variant={student.verificationStatus === "verified" ? "default" : "secondary"}>
                          {student.verificationStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-4">EAES Application Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Data Verification</span>
                      <Badge variant={student.verificationStatus === "verified" ? "default" : "destructive"}>
                        {student.verificationStatus === "verified" ? "✓ Verified" : "✗ Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>University Preferences</span>
                      <Badge variant={submission?.status === "submitted" ? "default" : "outline"}>
                        {submission?.status === "submitted" ? "✓ Submitted" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Placement Status</span>
                      <Badge variant="outline">
                        {placement?.status === "placed" ? "Placed" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="placement">
            <Card>
              <CardHeader>
                <CardTitle>Placement Status</CardTitle>
                <CardDescription>Your university placement information</CardDescription>
              </CardHeader>
              <CardContent>
                {submission?.status === "submitted" ? (
                  <div className="space-y-6">
                    <div className="p-6 rounded-lg border bg-green-50 border-green-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-full bg-green-100">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Submitted
                              </Badge>
                            </div>
                            <h3 className="font-bold text-xl mb-1">Preferences Submitted Successfully!</h3>
                            <p className="text-muted-foreground mb-2">
                              Your university preferences have been submitted to EAES for processing.
                            </p>
                            <div className="space-y-1 text-sm">
                              <p><strong>Submission Date:</strong> {new Date(submission.submittedAt).toLocaleDateString()}</p>
                              <p><strong>Number of Universities Ranked:</strong> {universityPreferences.length}</p>
                              <p><strong>Placement Release Date:</strong> {new Date(placement.placementDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top 3 Choices Preview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Top 3 University Choices</CardTitle>
                        <CardDescription>These will receive priority consideration</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          {universityPreferences
                            .filter(uni => uni.isFavorite)
                            .sort((a, b) => a.rank - b.rank)
                            .slice(0, 3)
                            .map((uni) => (
                              <Card key={uni.id} className="border-yellow-200">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full mb-3 mx-auto">
                                    <span className="font-bold text-yellow-700">{uni.rank}</span>
                                  </div>
                                  <h4 className="font-semibold text-center">{uni.name}</h4>
                                  <p className="text-sm text-muted-foreground text-center">{uni.location}</p>
                                  <Badge className="mt-2 w-full justify-center bg-yellow-100 text-yellow-800 border-yellow-300">
                                    <Trophy className="w-3 h-3 mr-1" />
                                    Priority Choice
                                  </Badge>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800">Important EAES Information</h4>
                          <p className="text-blue-700 text-sm mt-1">
                            All student placements are released simultaneously on June 15, 2024.
                            EAES will process your university preferences along with your academic performance
                            to determine your placement. You will receive notification when results are available.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Preferences Not Submitted</h3>
                    <p className="text-muted-foreground mb-6">
                      You need to submit your university preferences to EAES before you can receive placement.
                      Go to the "Rank Universities" tab to complete your preferences.
                    </p>
                    <Button onClick={() => document.querySelector('[data-value="ranking"]').click()}>
                      Go to University Ranking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
            <DialogDescription>
              Update your personal information. Note: Academic information is locked.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={student.email} readOnly disabled />
              <p className="text-xs text-muted-foreground">Contact your school to update this field</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+251 91 234 5678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Home Address</Label>
              <Input id="address" placeholder="Enter your home address" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}