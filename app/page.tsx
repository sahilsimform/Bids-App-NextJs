import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { Novu } from "./components/novu.components";
import NewProduct from "./components/new.product";
import { revalidatePath } from "next/cache";
import BidInput from "./components/bid.input";
import { Novu as NovuId, TriggerRecipientsTypeEnum } from "@novu/node";
import LogoutButton from "./components/LogoutButton";

const NovuSecretKey = process.env.NEXT_PUBLIC_NOVU_SECRET_KEY as string;
const novuData = new NovuId(NovuSecretKey);

export default async function Home() {
  const login = cookies().get("login");

  const addBid = async (id: number, bid: number) => {
    "use server";
    await sql`UPDATE bids SET total_bids = total_bids + ${bid} WHERE id = ${id}`;
    const { rows } = await sql`SELECT * FROM bids WHERE id = ${id}`;

    await novuData.trigger("send-owner-notification-inapp", {
      to: [
        {
          subscriberId: rows[0].owner,
        },
      ],
      payload: {
        name: login?.value,
        bid: bid,
        subject: `New bid on your product!`,
        body: `${login?.value} placed a bid of ${bid} on your product.`,
      },
    });

    await novuData.topics.addSubscribers(`bid-${id}`, {
      subscribers: [`${login?.value}`],
    });

    await novuData.trigger("send-notification-inapp", {
      to: [{ type: TriggerRecipientsTypeEnum.TOPIC, topicKey: `bid-${id}` }],
      payload: {
        name: login?.value,
        bid: bid,
        subject: `New bid on product`,
        body: `${login?.value} placed a bid of ${bid}.`,
      },
      actor: { subscriberId: `${login?.value}` },
    });

    revalidatePath("/");
  };

  const addProduct = async (product: string) => {
    "use server";

    const { rows } =
      await sql`INSERT INTO bids (name, owner, total_bids) VALUES(${product}, ${login?.value}, 0)RETURNING id`;

    await novuData.topics.create({
      key: `bid-${rows[0].id}`,
      name: `People inside ${product} bid`,
    });

    revalidatePath("/");
  };
  const { rows } = await sql`SELECT * FROM bids ORDER BY id DESC`;

  return (
    <div className="">
      <div className="flex justify-between  ">
        <h2 className="mb-10 font-bold text-3xl">
          Logged in User: {login?.value}
        </h2>
        <div className="flex">
          <Novu user={login?.value ?? ""} />
          <LogoutButton />
        </div>
      </div>
      <NewProduct addProduct={addProduct} />
      <div className="flex flex-wrap gap-4">
        {rows.map((product) => (
          <div
            className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            key={product.name}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Product Name: {product.name}
            </h5>
            <h5 className="mb-2 text-xl font-normal tracking-tight text-gray-900 dark:text-white">
              Product Owner: {product.owner}
            </h5>
            <h5 className="mb-2 text-xl font-normal tracking-tight text-gray-900 dark:text-white">
              Product Bids: {product.total_bids}
            </h5>
            <div>
              <BidInput addBid={addBid} id={product.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
