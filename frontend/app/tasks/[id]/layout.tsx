import { mockTasks } from "@/lib/mock-data"

// 为静态导出生成参数
export async function generateStaticParams() {
  return mockTasks.map((task) => ({
    id: task.id,
  }))
}

export default function TaskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}