import CreditHistory from '@/components/credits/CreditHistory'

export default function AccountPage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">账户</h1>

      {/* 积分余额 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">积分余额</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <CreditHistory />
        </div>
      </section>
    </main>
  )
}