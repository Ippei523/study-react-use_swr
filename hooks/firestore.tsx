import { db } from "@/app/firebase"
import { getDoc, getDocs, collection, orderBy, query, doc } from "firebase/firestore"
import useSWR from "swr"
import { Todo } from "@/app/type"

const collectionName = 'todos'

// データを取得する関数
const fetchAllData = async () => {
  const querySnapshot = await getDocs(query(collection(db, collectionName), orderBy('createdAt', 'desc')))
  const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  return data as Todo[]
}

const fetchData = async (id: string) => {
  const data = await getDoc(doc(db, collectionName, id))
  return data.data() as Todo
}

// SWRを使用してデータを取得するカスタムフック
export const useGetFirestoreAllData = () => {
  const { data, error } = useSWR(collectionName, () => fetchAllData())

  return {
    data,
    isLoading: !data && !error,
    isError: error,
  }
}

export const useGetFirestoreData = (id: string) => {
  const { data, error } = useSWR(`${collectionName}/${id}`, () => fetchData(id))

  return {
    data,
    isLoading: !data && !error,
    isError: error,
  }
}
