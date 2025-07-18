import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { TaskFilters, TaskStatus } from "@/types/task";
import { FiRefreshCw, FiSearch } from "react-icons/fi";

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function TaskFiltersComponent({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: TaskFiltersProps) {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const sortOptions = [
    { value: "created_at", label: "Created Date" },
    { value: "updated_at", label: "Updated Date" },
    { value: "title", label: "Title" },
    { value: "status", label: "Status" },
    { value: "end_date", label: "End Date" },
  ];

  const orderOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ];

  return (
    <div className="bg-bg-card border border-border-light rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Filters & Search
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          label="Search by Title"
          value={filters.title || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, title: e.target.value })
          }
          placeholder="Enter task title..."
        />

        <Select
          label="Status"
          value={filters.status || ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: e.target.value as TaskStatus,
            })
          }
          options={statusOptions}
        />

        <Select
          label="Sort By"
          value={filters.sort_by || "created_at"}
          onChange={(e) =>
            onFiltersChange({ ...filters, sort_by: e.target.value })
          }
          options={sortOptions}
        />

        <Select
          label="Order"
          value={filters.order || "desc"}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              order: e.target.value as "asc" | "desc",
            })
          }
          options={orderOptions}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Button onClick={onSearch} icon={<FiSearch />}>
          Search
        </Button>
        <Button variant="outline" icon={<FiRefreshCw />} onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
