// ** Import Next
import { NextPage } from 'next'

// ** Configs
import { PERMISSIONS } from 'src/configs/permission'

// ** views
import OrderProductListPage from 'src/views/pages/manage-order/order-product/OrderProductList'

type TProps = {}

const Index: NextPage<TProps> = () => {
  return <OrderProductListPage />
}

Index.permission = [PERMISSIONS.MANAGE_ORDER.ORDER.VIEW]
export default Index
