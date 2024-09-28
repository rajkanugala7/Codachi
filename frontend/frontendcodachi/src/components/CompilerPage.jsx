import React from "react";
import Split from "react-split";

export default function CompilerPage() {
  return (
    <div className="compiler">
      <div className="row navbar">
        <h1>Navbar</h1>
      </div>

      {/* Horizontal Split between Problem Statement and Code Editor/Test Cases */}
      <Split
        className="horizontal"
        sizes={[30, 70]} // Initial sizes of the two columns
        minSize={200}    // Minimum width in pixels for each column
        gutterSize={10}  // Size of the resizable gutter
        direction="horizontal" // Horizontal split
        cursor="col-resize" // Cursor when resizing
      >
        {/* Problem Statement */}
        <div className="probState">
          <h1>Problem Statement Lorem ipsum dolor, sit amet consectetur adipisicing elit. Inventore sunt odio nemo? Culpa quod dicta perspiciatis hic facilis dolore, aliquam, ratione eius velit, totam modi fuga labore quae inventore architecto.
          Ullam, pariatur! Iure, autem! Impedit dolorem quam qui eaque laboriosam necessitatibus nulla architecto ipsum explicabo ullam aut at vero fuga fugit accusamus, aspernatur saepe, iure quidem cumque laborum cupiditate. Et!
          Nemo repellendus placeat non maxime nulla quos quae asperiores? Perspiciatis voluptatem nemo accusantium ab! Voluptate reprehenderit eveniet molestias iusto nihil cupiditate accusantium quam, laudantium repudiandae voluptates eos aperiam eum odio.
          Error, velit veritatis? Repudiandae sequi libero nesciunt voluptates nulla, quasi expedita doloribus adipisci, excepturi voluptatibus harum quam. Voluptas, enim explicabo libero nihil earum eligendi, architecto quia dignissimos consequatur at quis.
          Sapiente repellat accusamus quae facere blanditiis consectetur provident, ex vero quis odio voluptatum, at perferendis et quasi possimus saepe, ratione tempore? Tenetur, neque. Iusto sequi, dolorem rerum at neque non?</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae...
          </p>
        </div>

        {/* Code Editor */}
        <div className="codeeditor">
          <div className="editor" contentEditable="true">
            <h1>Code Editor Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima, dignissimos necessitatibus quo aperiam maiores placeat. Nobis vel nam, incidunt consequatur quas voluptatibus deleniti illum possimus error, optio fuga quod molestiae.
            Doloribus cupiditate dolorum ducimus repudiandae voluptas ipsum itaque odio excepturi delectus fugit reprehenderit enim exercitationem suscipit voluptate quaerat repellat, tenetur asperiores, magni tempora ullam, iste quam deserunt omnis necessitatibus. Illum!
            Est qui pariatur nam dolor ea consequatur fuga laborum tempore, rem, perferendis modi maiores ipsam neque? Numquam non delectus facilis commodi, officiis beatae cum esse accusamus quasi exercitationem, cupiditate molestias?
            Vero eligendi consequatur incidunt labore. Voluptate eius perspiciatis in numquam eos tempora quos accusamus, illum ab corrupti aperiam maxime provident laborum officia quasi debitis inventore impedit placeat. Incidunt, eos similique?
            Distinctio officia eligendi amet, eius modi animi libero maiores, ratione nemo doloribus laboriosam culpa molestiae et maxime repudiandae tempora a odit cupiditate labore in, vitae excepturi esse. Sit, ducimus sed.</h1>
            <p>Type your code here...</p>
          </div>

          {/* Test Cases Section (No Split) */}
          <div className="testcases mt-5">
            <h1>Test Cases Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus voluptatem iste ad quos eum! Assumenda recusandae natus nesciunt eius, perferendis officia pariatur? Ducimus aspernatur sunt blanditiis eaque tenetur voluptates porro?
            Libero, aut impedit omnis quaerat optio voluptatibus repellat nam in sint laudantium, voluptate fuga hic, assumenda fugit dicta. Veniam voluptatibus iste ipsum saepe porro nostrum ratione ducimus tempore libero ullam.
            Nihil voluptas natus molestiae deleniti fuga sint, inventore voluptatem laboriosam eius unde veniam, vitae commodi fugiat, ipsum enim debitis? Natus corporis id veritatis eligendi aut eveniet soluta earum numquam reiciendis!
            Aperiam voluptatem ipsum nobis expedita. Eaque, quis dicta dolorem ullam nulla exercitationem voluptatum dolores aliquam iusto rem asperiores illum cum, at commodi perspiciatis optio aspernatur corporis magni necessitatibus eum. Sed.
            Repudiandae corrupti eligendi vero quis accusantium voluptate dolorem enim eum officiis, iusto alias. Possimus earum aut veritatis fuga enim soluta ipsa perspiciatis error incidunt nihil. Possimus, dolor? Iusto, reiciendis tenetur.</h1>
            <p>Add your test cases here...</p>
          </div>
        </div>
      </Split>
    </div>
  );
}
