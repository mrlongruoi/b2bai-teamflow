import { Skeleton } from "@/components/ui/skeleton";

const THREAD_REPLY_SKELETON_KEYS = [
	"thread-reply-skeleton-1",
	"thread-reply-skeleton-2",
	"thread-reply-skeleton-3",
];

export function ThreadSidebarSkeleton() {
	return (
		<div className="w-120 border-l flex flex-col h-full">
			<div className="border-b h-14 px-4 flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<Skeleton className="size-4" />
					<Skeleton className="h-4 w-16" />
				</div>

				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-20" />
					<Skeleton className="size-8" />
				</div>
			</div>

			{/* main content skeleton */}
			<div className="flex-1 overflow-y-auto">
				<div className="p-4 border-b bg-muted/20">
					<div className="flex space-x-3">
						<Skeleton className="size-8 rounded-full shrink-0" />
						<div className="flex-1 space-y-2 min-w-0">
							<div className="flex items-center space-x-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-3 w-16" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>
					</div>
				</div>

				{/* thread replies skeletons */}
				<div className="p-2">
					<div className="px-2 mb-3">
						<Skeleton className="h-3 w-16" />
					</div>

					<div className="space-y-3">
						{/* reply skeleton */}
						{THREAD_REPLY_SKELETON_KEYS.map((key) => (
							<div className="flex space-x-3 px-2" key={key}>
								<Skeleton className="size-8 rounded-full shrink-0" />
								<div className="flex-1 space-y-1">
									<div className="flex items-center space-x-2">
										<Skeleton className="h-3 w-16" />
										<Skeleton className="h-3 w-12" />
									</div>
									<div className="flex flex-col space-y-1">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-2/3" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* reply form skeleton */}
			<div className="border-t p-4">
				<Skeleton className="h-56 w-full rounded-md" />
			</div>
		</div>
	);
}