import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <Card className="mt-10 w-full max-w-sm md:max-w-[494px] bg-white/90 backdrop-blur-sm border-0 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.10)]">
      <CardContent className="flex flex-col items-center px-15 pb-3 py-auto">
        {/* REPLACE_NCCU_BADGE */}
        <img
          src="https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/ncculogored%20only.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL25jY3Vsb2dvcmVkIG9ubHkucG5nIiwiaWF0IjoxNzc0OTU2MjgzLCJleHAiOjE4MDY0OTIyODN9.P9rU4dgl4YAWXZZlPVOEoGa7DUqO-uZZ__w2vvrUUAg"
          alt="NCCU Badge"
          className="w-24 h-24 md:w-35 md:h-35 object-contain mb-3 rounded-full"
        />
        {children}
      </CardContent>
    </Card>
  );
}
