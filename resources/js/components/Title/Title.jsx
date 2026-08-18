import styles from "./Title.module.css"

export default function Title({ title, desc }) {
  return (
    <div>
      <p className={styles.title}>{title}</p>
      <p className={styles.desc}>{desc}</p>
    </div>
  )
}