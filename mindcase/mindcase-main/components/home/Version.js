"use client"
import "./Version.css";
import { Button } from "@/components/ui/button"

export default function Version({ title }) {
  return <Button className="btn-version" variant="ghost">{title}</Button>
}
