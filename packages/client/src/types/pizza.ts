export interface Pizza {
  id: string;
  name: string;
  description: string;
  toppingIds: string[];
  imgSrc: string;
  toppings: Array<{
    id: string;
    name: string;
    priceCents: number;
  }>;
}
