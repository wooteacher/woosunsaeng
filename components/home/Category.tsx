import {
  Wifi,
  Smartphone,
  Laptop,
  Tablet,
  Building2,
  Package,
} from "lucide-react";

const categories = [
  { title: "인터넷", icon: Wifi },
  { title: "휴대폰", icon: Smartphone },
  { title: "노트북", icon: Laptop },
  { title: "태블릿", icon: Tablet },
  { title: "기업렌탈", icon: Building2 },
  { title: "패키지", icon: Package },
];

export default function Category() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-12 text-center text-4xl font-bold">
          서비스 안내
        </h2>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">

          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:border-green-500 hover:shadow-xl"
              >
                <Icon
                  size={46}
                  className="mx-auto text-green-600 transition group-hover:scale-110"
                />

                <h3 className="mt-5 font-bold text-lg">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}