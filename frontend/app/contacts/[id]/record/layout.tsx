import { mockContacts } from "@/lib/mock-data"

// 为静态导出生成参数
export async function generateStaticParams() {
  return mockContacts.map((contact) => ({
    id: contact.id,
  }))
}

export default function RecordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}