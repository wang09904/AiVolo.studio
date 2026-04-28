"use client";

import { useState } from "react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 模拟表单提交
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="flex-1 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">联系我们</h1>
        <p className="text-gray-600 text-center mb-12">
          有任何问题或建议？我们随时为您服务
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* 联系方式 */}
          <div>
            <h2 className="text-xl font-semibold mb-6">联系方式</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">邮箱</h3>
                <a
                  href="mailto:wang19904@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  wang19904@gmail.com
                </a>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-medium mb-2">响应时间</h3>
                <p className="text-gray-600">
                  我们通常在 24 小时内回复您的邮件。<br />
                  工作时间：周一至周五 9:00-18:00（北京时间）
                </p>
              </div>
            </div>
          </div>

          {/* 联系表单 */}
          <div>
            <h2 className="text-xl font-semibold mb-6">发送消息</h2>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-medium text-green-800 mb-2">消息已发送</h3>
                <p className="text-green-700">感谢您的留言，我们会尽快回复您。</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    名字
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="您的名字"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    内容
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="请输入您的留言..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "发送中..." : "发送消息"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
