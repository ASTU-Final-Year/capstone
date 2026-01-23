// src/components/notifications/NotificationDropdown.jsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { 
    UserPlus, 
    FileText, 
    Calendar, 
    Info, 
    AlertCircle, 
    Check,
    Mail,
    Users,
    CheckCircle,
    XCircle,
    TrendingUp
} from "lucide-react"

const iconMap = {
    new_application: UserPlus,
    placement_pending: FileText,
    deadline: Calendar,
    system: Info,
    capacity: AlertCircle,
    application: Check,
    mail: Mail,
    users: Users,
    check: CheckCircle,
    warning: AlertCircle,
    success: CheckCircle,
    error: XCircle,
    trending: TrendingUp
}

const iconColorMap = {
    new_application: "text-blue-500",
    placement_pending: "text-amber-500",
    deadline: "text-red-500",
    system: "text-gray-500",
    capacity: "text-orange-500",
    application: "text-green-500",
    mail: "text-blue-500",
    users: "text-purple-500",
    check: "text-green-500",
    warning: "text-amber-500",
    success: "text-green-500",
    error: "text-red-500",
    trending: "text-blue-500"
}

export default function NotificationDropdown({ 
    className,
    variant = "ghost",
    size = "sm"
}) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "new_application",
            title: "New Application Received",
            description: "Student: Michael Getachew (GPA: 3.8)",
            time: new Date(Date.now() - 10 * 60000).toISOString(),
            read: false
        },
        {
            id: 2,
            type: "placement_pending",
            title: "Placement Decision Required",
            description: "5 placements awaiting your review",
            time: new Date(Date.now() - 60 * 60000).toISOString(),
            read: false
        },
        {
            id: 3,
            type: "deadline",
            title: "Application Deadline Approaching",
            description: "3 days left for 2024 applications",
            time: new Date(Date.now() - 120 * 60000).toISOString(),
            read: false
        },
        {
            id: 4,
            type: "system",
            title: "System Maintenance",
            description: "Scheduled maintenance on Saturday, 2 AM",
            time: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
            read: true
        }
    ])

    // Get icon component
    const getIcon = (type) => {
        return iconMap[type] || Bell
    }

    // Get icon color
    const getIconColor = (type) => {
        return iconColorMap[type] || "text-gray-500"
    }

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    // Filter notifications
    const unreadNotifications = notifications.filter(n => !n.read)
    const readNotifications = notifications.filter(n => n.read)

    // Handle mark as read
    const handleMarkAsRead = (id) => {
        setNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    // Handle mark all as read
    const handleMarkAllAsRead = () => {
        setNotifications(prev => 
            prev.map(n => ({ ...n, read: true }))
        )
        setIsOpen(false)
    }

    // Handle view all notifications
    const handleViewAll = () => {
        setIsOpen(false)
        router.push("/dashboard/notifications")
    }

    // Add a new notification (public method if needed)
    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now(),
            time: new Date().toISOString(),
            read: false,
            ...notification
        }
        setNotifications(prev => [newNotification, ...prev])
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant={variant}
                    size={size}
                    className={cn("relative", className)}
                >
                    <Bell className="w-4 h-4" />
                    {unreadNotifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                className="w-96 max-h-[500px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadNotifications.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={handleMarkAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Unread Notifications */}
                {unreadNotifications.length > 0 && (
                    <div className="px-2 py-1">
                        <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                            UNREAD ({unreadNotifications.length})
                        </div>
                        {unreadNotifications.map((notification) => {
                            const Icon = getIcon(notification.type)
                            const iconColor = getIconColor(notification.type)
                            
                            return (
                                <DropdownMenuItem 
                                    key={notification.id} 
                                    className="py-3 px-2 cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3 w-full">
                                        <div className={`p-2 rounded-full bg-muted ${iconColor.replace("text-", "bg-")}/10`}>
                                            <Icon className={`w-4 h-4 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-sm">{notification.title}</p>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTime(notification.time)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 truncate">
                                                {notification.description}
                                            </p>
                                        </div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    </div>
                                </DropdownMenuItem>
                            )
                        })}
                    </div>
                )}

                {/* Read Notifications */}
                {readNotifications.length > 0 && (
                    <>
                        {unreadNotifications.length > 0 && <DropdownMenuSeparator />}
                        <div className="px-2 py-1">
                            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                                EARLIER ({readNotifications.length})
                            </div>
                            {readNotifications.map((notification) => {
                                const Icon = getIcon(notification.type)
                                const iconColor = getIconColor(notification.type)
                                
                                return (
                                    <DropdownMenuItem 
                                        key={notification.id} 
                                        className="py-3 px-2 cursor-pointer hover:bg-muted/50 opacity-70"
                                    >
                                        <div className="flex items-start gap-3 w-full">
                                            <div className={`p-2 rounded-full bg-muted ${iconColor.replace("text-", "bg-")}/10`}>
                                                <Icon className={`w-4 h-4 ${iconColor}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-medium text-sm">{notification.title}</p>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTime(notification.time)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1 truncate">
                                                    {notification.description}
                                                </p>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {notifications.length === 0 && (
                    <div className="px-4 py-8 text-center">
                        <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                    </div>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-sm py-2 cursor-pointer">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={handleViewAll}
                    >
                        View All Notifications
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Export a hook to add notifications from other components
export function useNotification() {
    const [dropdownInstance, setDropdownInstance] = useState(null)

    const addNotification = (notification) => {
        if (dropdownInstance && dropdownInstance.addNotification) {
            dropdownInstance.addNotification(notification)
        } else {
            console.warn("NotificationDropdown not mounted or addNotification method not available")
        }
    }

    return { addNotification, setDropdownInstance }
}