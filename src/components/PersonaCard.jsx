import React from "react";

// 성별과 인덱스를 기반으로 이미지 선택
const getCharacterImage = (gender, index) => {
  const genderKey = gender.toLowerCase() === "female" ? "female" : "male";
  const characterList = {
    male: [
      require("../assets/character-male-a.png"),
      require("../assets/character-male-b.png"),
      require("../assets/character-male-c.png"),
      require("../assets/character-male-d.png"),
      require("../assets/character-male-e.png"),
      require("../assets/character-male-f.png"),
    ],
    female: [
      require("../assets/character-female-a.png"),
      require("../assets/character-female-b.png"),
      require("../assets/character-female-c.png"),
      require("../assets/character-female-d.png"),
      require("../assets/character-female-e.png"),
      require("../assets/character-female-f.png"),
    ],
  };
  const images = characterList[genderKey];
  return images[index % images.length]; // 인덱스로 순환
};

export default function PersonaCard({ persona, index }) {
  const characterImg = getCharacterImage(persona.gender, index);

  return (
    <div className="border border-gray-300 rounded-xl p-4 bg-yellow-100 shadow text-center w-full max-w-xs">
      <img
        src={characterImg}
        alt="persona character"
        className="mx-auto w-20 h-20 mb-3 pixelated"
        style={{ imageRendering: "pixelated" }}
      />
      <h3 className="text-lg font-bold mb-1 font-mono">Persona</h3>
      <p className="text-sm text-gray-700">
        <strong>Age:</strong> {persona.age_group}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Gender:</strong> {persona.gender}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Facilities:</strong>{" "}
        {persona.preferred_facilities?.join(", ")}
      </p>
      <p className="text-xs italic text-gray-600 mt-2">
        "{persona.profile_prompt}"
      </p>
    </div>
  );
}
