import AddAuthorPage from "../optionsPages/addAuthor";
import AddCategoryPage from "../optionsPages/addCategory";
import AddTagsPage from "../optionsPages/addTags";
import UserPage from "../optionsPages/userPage";
import BlogPage from "../optionsPages/blogPage";
import CreateBlogPage from "../optionsPages/createBlog";
import { ProductPage } from "../optionsPages/productPage";
import SellerHelpdeskPage from "../optionsPages/sellerHelpdesk";
import VendorPage from "../optionsPages/vendorPage";
import DetailsPage from "../optionsPages/detailsPage";
import CouponPage from "../optionsPages/couponPage";
import OrderPage from "../optionsPages/order";

export const OptionPageProvider = ({ active }: { active: string }) => {
  console.log(active);
  return (
    <>
      {active == "blogs" && <BlogPage />}
      {active == "tags" && <AddTagsPage />}
      {active == "categories" && <AddCategoryPage />}
      {active == "author" && <AddAuthorPage />}
      {active == "vendorhelpdesk" && <SellerHelpdeskPage />}
      {active == "userhelpdesk" && <SellerHelpdeskPage />}
      {active == "vendors" && <VendorPage />}
      {active == "products" && <ProductPage />}
      {active == "orders" && <OrderPage />}
      {active == "payments" && <ProductPage />}
      {active == "courses" && <ProductPage />}
      {active == "coupons" && <CouponPage />}
      {active == "createblog" && <CreateBlogPage />}
      {active == "users" && <UserPage />}
      {active == "team" && <UserPage />}
      {active == "sellerlanding" && <DetailsPage />}
    </>
  );
};
