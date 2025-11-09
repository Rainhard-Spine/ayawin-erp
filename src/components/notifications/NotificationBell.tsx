import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export const NotificationBell = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as Notification[];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          toast.info(payload.new.title, {
            description: payload.new.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = (notification: Notification) => {
    markAsReadMutation.mutate(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      case "success":
        return "text-green-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="font-semibold p-2">Notifications</div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start p-3 cursor-pointer"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`font-semibold ${getNotificationColor(notification.type)} ${
                    !notification.is_read ? "font-bold" : ""
                  }`}
                >
                  {notification.title}
                </span>
                {!notification.is_read && (
                  <Badge variant="default" className="ml-2">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
              <span className="text-xs text-muted-foreground mt-1">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
