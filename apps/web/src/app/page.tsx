export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4">Turkish Baby Name Finder</h1>
        <p className="text-xl text-gray-600 mb-8">
          60 saniyede size özel Türk bebek ismi önerileri
        </p>

        <div className="bg-turkish-gray p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Hoş geldiniz!</h2>
          <p className="text-gray-700 mb-6">
            Bu uygulama kültür, ses, sıklık, trend, bölgesel lezzet, evrak mantığı ve
            aile kısıtlamaları açısından uygunluğa göre isimleri sıralar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-white p-4 rounded">
              <h3 className="font-semibold mb-2">📊 Veri Kaynakları</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• TDK Kişi Adları Sözlüğü</li>
                <li>• TÜİK Nüfus İstatistikleri</li>
                <li>• ICU/CLDR Türkçe Kuralları</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded">
              <h3 className="font-semibold mb-2">✨ Özellikler</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 6 ekranda kişiselleştirme</li>
                <li>• Şeffaf puanlama sistemi</li>
                <li>• Soyad uyumu analizi</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded">
              <h3 className="font-semibold mb-2">🎯 Türkçeye Özel</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• i/ı/İ/I doğru işlenir</li>
                <li>• Türkçe harmoni analizi</li>
                <li>• Hece ve vurgu tespiti</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded">
              <h3 className="font-semibold mb-2">🔒 Gizlilik</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• KVKK uyumlu</li>
                <li>• Kişisel veri saklanmaz</li>
                <li>• İsteğe bağlı telemetri</li>
              </ul>
            </div>
          </div>

          <button className="mt-8 bg-turkish-red text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Başla
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            v0.1.0 • Monorepo: Turborepo + Next.js 15 + Expo • Database: PostgreSQL
            + Prisma
          </p>
        </div>
      </div>
    </main>
  );
}
