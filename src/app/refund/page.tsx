import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "退款政策 - AiVolo.studio",
  description: "AiVolo.studio 退款政策说明",
};

export default function RefundPage() {
  return (
    <main className="flex-1 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">退款政策</h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. 概述</h2>
            <p>
              我们致力于为您提供优质的 AI 生成服务。如果您对服务不满意，我们将在符合以下条件的情况下提供退款。退款申请审核通常需要 3-5 个工作日。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 积分退款</h2>
            <p>
              单独购买的积分（不含订阅）在购买后 7 天内可申请退款，但需满足以下条件：
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>积分使用量不超过购买总量的 20%</li>
              <li>提供有效的退款理由</li>
              <li>同一账户无多次退款记录</li>
            </ul>
            <p className="mt-2">
              已消耗的积分不可退款。未使用的积分可按原购买渠道原路退回。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2.1 积分定价表（退款计算依据）</h2>
            <p className="mb-3">
              退款金额计算公式：<strong>退款金额 = 订单金额 - (已生成次数 × 对应单价)</strong>
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">消耗类型</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">单价</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">文生图（基础模型）</td>
                    <td className="px-4 py-3 text-sm text-gray-700">$0.020/张</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Imagen 3</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">文生图（高级模型）</td>
                    <td className="px-4 py-3 text-sm text-gray-700">$0.050/张</td>
                    <td className="px-4 py-3 text-sm text-gray-500">GPT Image 2</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">图生图（基础模型）</td>
                    <td className="px-4 py-3 text-sm text-gray-700">$0.030/张</td>
                    <td className="px-4 py-3 text-sm text-gray-500">Imagen 3</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">图生图（高级模型）</td>
                    <td className="px-4 py-3 text-sm text-gray-700">$0.080/张</td>
                    <td className="px-4 py-3 text-sm text-gray-500">GPT Image 2</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">文生视频（标准）</td>
                    <td className="px-4 py-3 text-sm text-gray-700">$0.200/秒</td>
                    <td className="px-4 py-3 text-sm text-gray-500">GPT Video</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">图生视频（标准）</td>
                    <td className="px-4 py-3 text-sm text-gray-700">$0.300/秒</td>
                    <td className="px-4 py-3 text-sm text-gray-500">GPT Video</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 订阅退款</h2>
            <p>
              月度订阅和年度订阅适用以下退款政策：
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>7 天无理由退款：</strong>新订阅用户在首次订阅后 7 天内可申请全额退款</li>
              <li><strong>服务故障退款：</strong>因我们的服务故障导致无法正常使用超过连续 24 小时的，可申请按故障时长比例退款</li>
              <li><strong>特殊情况：</strong>如遇不可抗力或重大服务变更，我们将酌情处理</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. 不可退款的情况</h2>
            <p>以下情况不在退款范围内：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>订阅超过 7 天且服务正常运行的</li>
              <li>积分购买超过 7 天的</li>
              <li>因用户自身原因（如误操作、不满意生成结果等）要求退款的</li>
              <li>因违反用户协议被终止服务的</li>
              <li>已使用积分兑换的服务或内容</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. 如何申请退款</h2>
            <p>申请退款请通过以下方式联系我们：</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>发送邮件至 <a href="mailto:support@aivolo.studio" className="text-blue-600 hover:underline">support@aivolo.studio</a></li>
              <li>邮件标题请注明&quot;退款申请&quot;</li>
              <li>在邮件中提供：账户邮箱、退款原因、订单编号（如有）</li>
              <li>我们将在一周内审核并回复您的申请</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. 退款方式</h2>
            <p>
              审核通过后，退款将按原支付方式退回：
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>信用卡/借记卡：</strong>退款到原卡，约 5-10 个工作日到账</li>
              <li><strong>其他支付方式：</strong>根据具体方式确定退款周期</li>
            </ul>
            <p className="mt-2">
              如原支付方式无法退款（如卡已注销），请联系我们协商其他退款方式。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. 争议交易</h2>
            <p>
              如您对某笔交易有争议，请在交易日期后 30 天内联系我们。争议交易可能会触发支付平台的调查程序，我们会配合提供相关证据。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. 积分与订阅终止</h2>
            <p>
              退款成功后，相关积分或订阅将被立即取消。已享受的优惠（如首月折扣）将在退款金额中扣除。账户中剩余的有效积分也将被清零。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. 联系我们</h2>
            <p>
              如您对退款政策有任何疑问，请联系我们的客服团队：<br />
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
