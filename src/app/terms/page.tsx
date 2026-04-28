import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "用户协议 - AiVolo.studio",
  description: "AiVolo.studio 用户服务协议",
};

export default function TermsPage() {
  return (
    <main className="flex-1 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">用户协议</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. 服务说明</h2>
            <p>
              AiVolo.studio 提供 AI 图片和视频生成服务。使用本服务即表示您同意遵守本协议的所有条款。我们保留随时修改服务条款的权利，修改后的条款将在本页面发布之日起生效。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 账户注册与责任</h2>
            <p>
              您需要使用 Google 账户注册并登录 AiVolo.studio。您承诺对账户的所有活动负责，并同意立即通知我们任何未经授权的使用。我们不对因您未能保护账户凭据而造成的任何损失负责。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 使用规范</h2>
            <p>您同意不会使用本服务生成以下内容：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>违反法律法规的内容</li>
              <li>侵犯他人知识产权的内容</li>
              <li>色情、暴力、歧视性内容</li>
              <li>虚假信息或误导性内容</li>
              <li>任何可能危害未成年人安全的内容</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. 知识产权</h2>
            <p>
              您保留对通过本服务生成的原创内容的知识产权。但您需对输入的提示词（Prompt）以及生成内容的所有使用方式负责。对于因使用生成内容而引起的任何第三方索赔，您同意赔偿我们并使我们免受损害。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. 积分与订阅</h2>
            <p>
              积分用于支付 AI 生成服务，不可兑换现金。不同订阅计划提供不同额度的积分，积分有有效期限，请在有效期内使用。订阅会自动续期，除非您在当前计费周期结束前取消订阅。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. 服务可用性</h2>
            <p>
              我们努力保证服务的持续可用性，但不对服务中断承担责任。我们可能会定期维护系统，届时服务可能会暂时不可用。我们会提前通知预计的维护时间，但在紧急情况下可能无法提前通知。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. 免责声明</h2>
            <p>
              本服务按&quot;原样&quot;提供，我们不对服务的准确性、完整性或可靠性做任何明示或暗示的保证。在法律允许的最大范围内，我们不对任何直接、间接、偶然、特殊或后果性损害承担责任。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. 协议修改</h2>
            <p>
              我们保留随时修改本协议的权利。修改后的协议将在本页面发布，并自发布之日起生效。继续使用服务即表示您接受修改后的协议。如果您不同意修改后的协议，请停止使用服务。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. 适用法律与争议解决</h2>
            <p>
              本协议受中华人民共和国法律管辖。因本协议引起的任何争议，双方应首先通过友好协商解决；协商不成的，任何一方均可向有管辖权的人民法院提起诉讼。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. 联系我们</h2>
            <p>
              如您对本协议有任何疑问，请通过以下方式联系我们：<br />
              邮箱：<a href="mailto:support@aivolo.studio" className="text-blue-600 hover:underline">support@aivolo.studio</a>
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
