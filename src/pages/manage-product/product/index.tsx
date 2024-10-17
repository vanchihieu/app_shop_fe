// ** Import Next
import { NextPage } from 'next'

// ** Config
import { PERMISSIONS } from 'src/configs/permission'
import ProductListPage from 'src/views/pages/manage-product/product/ProductList'

// ** views

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <ProductListPage />
}

Index.permission = [PERMISSIONS.MANAGE_PRODUCT.PRODUCT.VIEW]
export default Index
