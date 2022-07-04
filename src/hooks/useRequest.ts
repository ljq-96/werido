import { useCallback, useState } from 'react'
import { IResponse } from '../../server/interfaces'

const useRequest = <DataType>(asnycFunction: () => Promise<IResponse<DataType>>, resetData?: boolean) => {
  const [data, setData] = useState<DataType | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(() => {
    resetData && setData(null)
    setLoading(true)
    return asnycFunction()
      .then((res) => {
        setLoading(false)
        if (res.code === 0) {
          setData(res.data)
        }
        return res
      })
      .catch((e) => Promise.reject(e))
      .finally(() => setLoading(false))
  }, [asnycFunction])

  return { execute, data, loading }
}

export default useRequest
