import Sidebar from "../components/layout/Sidebar";
import BoardHeader from "../components/layout/BoardHeader";
import Board from "../components/board/Board";
import Footer from "../components/layout/Footer";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />

      {/* ✅ min-w-0: Kanban scroll problemini bitirir */}
      <main className="flex-1 min-w-0 p-4">
        <BoardHeader />
        <Board />
        <Footer />
      </main>
    </div>
  );
}
