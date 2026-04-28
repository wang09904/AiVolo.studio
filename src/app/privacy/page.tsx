import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 - AiVolo.studio",
  description: "AiVolo.studio 隐私政策说明",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">隐私政策</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. 信息收集</h2>
            <p>
              我们收集以下信息以提供服务：
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>账户信息：</strong>通过 Google OAuth 获取您的电子邮件地址和公开的个人资料信息</li>
              <li><strong>使用数据：</strong>包括生成内容、提示词、使用时间、积分消耗等</li>
              <li><strong>设备信息：</strong>浏览器类型、操作系统、IP 地址等基本信息</li>
              <li><strong>Cookie：</strong>用于保持登录状态和记住您的偏好设置</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 信息使用</h2>
            <p>我们使用收集的信息用于：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>提供、维护和改进我们的服务</li>
              <li>处理您的生成请求</li>
              <li>管理您的账户和订阅</li>
              <li>与您沟通关于服务的重要更新</li>
              <li>检测和预防欺诈或滥用行为</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 信息存储</h2>
            <p>
              您的数据存储在符合 GDPR 要求的服务器上。我们采用行业标准的安全措施保护您的个人信息，包括加密存储、访问控制和定期安全审计。
            </p>
            <p className="mt-2">
              生成的内容将根据您的订阅级别保存一定时间：免费用户 7 天，Lite 会员 30 天，Pro 会员 1 年。之后这些内容将被自动删除。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. 数据共享</h2>
            <p>我们不会出售您的个人信息。我们仅在以下情况下共享数据：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>服务提供商：</strong>与帮助我们运营服务的第三方提供商共享（如云存储、支付处理），这些提供商受到保密协议约束</li>
              <li><strong>法律要求：</strong>当法律要求或为了保护我们的合法权益而必须披露时</li>
              <li><strong>您的同意：</strong>在获得您明确同意后</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. 您的权利（GDPR 合规）</h2>
            <p>根据 GDPR，您拥有以下权利：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>访问权：</strong>请求获取我们持有的关于您的个人数据</li>
              <li><strong>更正权：</strong>请求更正不准确的个人数据</li>
              <li><strong>删除权：</strong>请求删除您的个人数据（&quot;被遗忘权&quot;）</li>
              <li><strong>限制处理权：</strong>请求限制我们处理您的数据</li>
              <li><strong>数据可携带权：</strong>以结构化、常用格式接收您的数据</li>
              <li><strong>反对权：</strong>反对我们处理您的数据</li>
              <li><strong>投诉权：</strong>向当地数据保护机构投诉</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Cookie 政策</h2>
            <p>
              我们使用必要的 Cookie 来保证服务的基本功能。必要 Cookie 无法禁用，因为没有它们服务将无法正常工作。我们使用以下类型的 Cookie：
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>会话 Cookie：</strong>临时存储，仅在您关闭浏览器前有效</li>
              <li><strong>持久 Cookie：</strong>记住您的偏好设置（如语言选择）</li>
              <li><strong>第三方 Cookie：</strong>由我们的服务提供商设置（如分析工具）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. 数据保护</h2>
            <p>
              我们实施以下安全措施：
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>传输层加密（TLS/SSL）</li>
              <li>静态数据加密</li>
              <li>定期安全审计和渗透测试</li>
              <li>员工安全培训</li>
              <li>最小权限原则</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. 儿童隐私</h2>
            <p>
              我们的服务不面向 16 岁以下的儿童。我们不会故意收集 16 岁以下儿童的个人信息。如果您发现我们可能收集了儿童的信息，请联系我们，我们会立即删除相关数据。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. 隐私政策更新</h2>
            <p>
              我们可能会不时更新本隐私政策。重大变更将在本页面发布，并更新&quot;最后更新日期&quot;。我们鼓励您定期查看本政策以了解最新信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. 联系我们</h2>
            <p>
              如您对隐私政策有任何疑问或希望行使您的数据权利，请联系我们的数据保护官：<br />
              邮箱：<a href="mailto:privacy@aivolo.studio" className="text-blue-600 hover:underline">privacy@aivolo.studio</a>
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            最后更新日期：2026年4月28日
          </p>
        </div>
      </div>
    </main>
  );
}
