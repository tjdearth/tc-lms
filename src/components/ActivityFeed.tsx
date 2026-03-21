"use client";

interface ActivityItem {
  user_name: string;
  action: string;
  course_title: string;
  timestamp: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  const displayItems = items.slice(0, 10);

  if (displayItems.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        No recent activity
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {displayItems.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3 relative pl-4">
          {/* Timeline line */}
          {idx < displayItems.length - 1 && (
            <div className="absolute left-[1.9rem] top-10 bottom-0 w-px bg-[#E8ECF1]" />
          )}

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#304256] text-white flex items-center justify-center text-[10px] font-medium flex-shrink-0 relative z-10">
            {getInitials(item.user_name)}
          </div>

          <div className="flex-1 min-w-0 pb-4">
            <p className="text-sm text-[#304256]">
              <span className="font-medium">{item.user_name}</span>{" "}
              {item.action}{" "}
              <span className="font-medium">{item.course_title}</span>
            </p>
            <span className="text-[11px] text-gray-400">
              {timeAgo(item.timestamp)}
            </span>
          </div>
        </div>
      ))}

      {items.length > 10 && (
        <div className="pt-2 text-center">
          <button className="text-xs font-medium text-[#27a28c] hover:text-[#27a28c]/80 transition-colors">
            View all
          </button>
        </div>
      )}
    </div>
  );
}
