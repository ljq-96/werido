import { connect, ConnectRC, SCount } from 'umi';
import styles from './index.less';

interface IProps {
  count: number
}

const IndexPage: ConnectRC<IProps> = (props) => {
  const { count, dispatch } = props
  return (
    <div>
      <h1 className={styles.title}>{count}</h1>
      <button onClick={() => dispatch({type: 'count/add'})}>+</button>
      <button onClick={() => dispatch({type: 'count/minus'})}>-</button>
    </div>
  );
}

export default connect(({ count }: { count: number }) => {
  return { count }
})(IndexPage)
