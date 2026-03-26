import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types/general';
import { Link } from '@inertiajs/react';
import { ChevronRight, Table } from 'lucide-react';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const AdminBreadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  return (
    <nav className={cn('flex pb-0.5', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* 1. Always show Home icon as the root */}
        <li>
          <Link
            href="/admin"
            className="text-gray-300 transition-colors hover:text-gray-200"
          >
            <Table size={16} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight size={14} className="shrink-0 text-gray-400" />

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-sm font-medium whitespace-nowrap text-gray-300 transition-colors hover:text-gray-200"
                >
                  {item.title}
                </Link>
              ) : (
                <span className="text-sm whitespace-nowrap text-amber-100">
                  {item.title}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumbs;
